import React, { FormEvent, useEffect, useState } from 'react';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { useQueryClient } from 'react-query';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';

import SearchResults from '../SearchResults';
import { OMDBMovie, OMDBResponse } from '../../pages/api/movie-api';

export const MovieModal: React.FC = (): React.ReactElement => {
  const [results, setResults] = useState<OMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(``);
  const [success, setSuccess] = useState<{ type: string; data: any } | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const queryClient = useQueryClient();
  const initialRef = React.useRef(null);

  useEffect(() => {
    if (success) {
      queryClient.invalidateQueries(`movies`).catch(console.error);
      toast({
        variant: `subtle`,
        title: success.type === `addition` ? `Movie Added` : `Movie Deleted`,
        description:
          success.type === `addition`
            ? `${success.data?.name} was successfully added`
            : `${success.data.name} was successfully deleted`,
        status: `success`,
        duration: 5000,
        isClosable: true,
      });
      onClose();
      setSuccess(null);
    } else if (error) {
      toast({
        variant: `subtle`,
        title: `There was an error`,
        description: error,
        status: `error`,
        duration: 5000,
        isClosable: true,
      });
      setSuccess(null);
      setError('');
    }
  }, [success, error, onClose, queryClient, toast]);

  interface FormFields {
    0: HTMLInputElement;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error) setError(``);
    setLoading(true);
    const target = e.target as typeof e.target & FormFields;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URI}/api/movie-api?search=${target['0'].value}`
      );
      const data: OMDBResponse = await response.json();
      if (response.status !== 200) {
        console.error(data.status_message);
        return setError(data.status_message || 'An error occurred');
      }
      setLoading(false);
      if (!data?.results?.length) {
        setError(`No results found :(`);
      }
      setResults(data.results.splice(0, 5));
    } catch (err) {
      console.error(err);
      if (err) {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Button
        variant="solid"
        colorScheme="purple"
        mr={3}
        leftIcon={<AddIcon />}
        onClick={onOpen}
      >
        Add movie
      </Button>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a movie</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel>Find movie</FormLabel>
                <Flex>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gray.300" />
                    </InputLeftElement>
                    <Input
                      ref={initialRef}
                      name="movie"
                      type="text"
                      placeholder="Search OMDB..."
                    />
                  </InputGroup>
                  <Button type="submit" ml={5} colorScheme="purple">
                    Search
                  </Button>
                </Flex>
              </FormControl>
            </form>

            {results ? (
              <SearchResults
                data={results}
                loading={loading}
                error={error}
                setSuccess={setSuccess}
                setError={setError}
              />
            ) : (
              ``
            )}
          </ModalBody>

          <ModalFooter
            bg={useColorModeValue(`gray.50`, `gray.800`)}
            roundedBottom="md"
          >
            <Button colorScheme={'purple'} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
