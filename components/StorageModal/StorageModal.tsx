import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import React, { Fragment, useState } from 'react';
import {
  useDisclosure, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, Button, FormControl, FormLabel,
  Input, useToast, useColorModeValue, Select
} from '@chakra-ui/react';

export const StorageModal: React.FC = (): React.ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const initialRef = React.useRef(null);

  const [type, setType] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [bucket, setBucket] = useState("");
  const [region, setRegion] = useState("");
  const handleSubmit = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_APP_URI}/api/storage`;
      const response = await axios.post(url, { type, accessKey, secretKey, bucket, region });
      if (response.status !== 201) {
        toast({ description: response.data, status: "error" });
      } else {
        toast({ description: "Create new storage successful" });
      }
    } catch (error) {
      toast({ description: `Something error occured: ${error}`, status: "error" });
    }
  };

  return (
    <Fragment>
      <Button variant="solid" colorScheme="purple" mr={3} leftIcon={<AddIcon />} onClick={onOpen}>
        Add storage
      </Button>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a storage</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl id="type">
              <FormLabel>Type</FormLabel>
              <Select placeholder="Select option" isRequired value={type} onChange={e => {
                setType(e.target.value);
              }}>
                <option value="qiniu">Qiniu</option>
                <option value="minio">Minio</option>
              </Select>
            </FormControl>
            <FormControl id="accessKey"  >
              <FormLabel>Access Key</FormLabel>
              <Input type="text" value={accessKey} onChange={e => {
                setAccessKey(e.target.value);
              }} />
            </FormControl>
            <FormControl id="secretKey">
              <FormLabel>Secret Key</FormLabel>
              <Input type="text" value={secretKey} onChange={e => {
                setSecretKey(e.target.value);
              }} />
            </FormControl>
            <FormControl id="bucket">
              <FormLabel>Bucket</FormLabel>
              <Input type="text" value={bucket} onChange={e => {
                setBucket(e.target.value);
              }} />
            </FormControl>
            <FormControl id="region">
              <FormLabel>Region</FormLabel>
              <Input type="text" value={region} onChange={e => {
                setRegion(e.target.value);
              }} />
            </FormControl>
          </ModalBody>

          <ModalFooter bg={useColorModeValue(`gray.50`, `gray.800`)} roundedBottom="md" >
            <Button colorScheme={'purple'} onClick={handleSubmit}>
              Submit
            </Button>
            &nbsp;&nbsp;
            <Button colorScheme={'purple'} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Fragment >
  );
};
