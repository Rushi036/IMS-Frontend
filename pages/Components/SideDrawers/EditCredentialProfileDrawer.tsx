import { Drawer } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import CustomeInput from "../Inputs";
import { useAppContext } from "../AppContext";
import { Bounce, toast } from "react-toastify";
import replacePeriodsWithUnderscoresSingleObject, {
  replaceDotsWithUnderscores,
  replaceUnderscoresWithDots,
  replaceUnderscoresWithDotsNested,
} from "@/functions/genericFunctions";
import {
  createCredsProfile,
  getCredsProfileById,
  updateCredsProfile,
} from "@/pages/api/api/CredentialProfileAPI";
import SubmitButton, { CustomeCancelButton } from "../Buttons";
import SingleSelect from "../Selects";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles(() => ({
  drawer: {
    // width: drawerWidth,
    flexShrink: 100,
  },
  drawerPaper: {
    //  backgroundColor: dark ? "black" : "white",
    borderLeft: 0,
    boxShadow: "-5px 0 5px rgba(0, 0, 0, 0.1)",
    backdropFilter: "brightness(80%)", // Adjust the brightness for opacity
  },
}));
const EditCredentialProfileDrawer = (props: any) => {
  const { rowId, open, handleDrawerClose } = props;
  const [data, setData] = useState<any>({});
  const [protocol, setProtocol] = React.useState<any>("");
  const classes = useStyles();
  const { togglegetCredProfileApiState } = useAppContext();
  const [authType, setAuthType] = React.useState("");
  const [encryptType, setEncryptType] = React.useState("");
  const [msg_flag, setMsgFlag] = React.useState("");
  const [snmpObject, setSnmpObject] = React.useState({
    name: "",
    protocol: "SNMP",
    credential_context: {
      snmp_version: "",
      snmp_community: "",
    },
  });
  const [snmpv3Object, setSnmpv3Object] = React.useState({
    name: "",
    protocol: "SNMP",
    credential_context: {
      snmp_version: "v3",
      snmp_msg_flag: msg_flag,
      username: "",
      authentication_password: "",
      authentication_protocol: authType,
      privacy_protocol: encryptType,
      privacy_password: "",
    },
  });
  const [sshObject, setSSHObject] = React.useState({
    name: "",
    protocol: "SSH",
    credential_context: {
      username: "",
      password: "",
    },
    public_key: "",
    paraphase: "",
  });

  const msg_flag_values = [
    {
      value: "no.auth.no.priv",
      label: "No Auth No Privacy",
    },
    {
      value: "auth.no.priv",
      label: "Auth No Privacy",
    },
    {
      value: "auth.priv",
      label: "Auth Privacy",
    },
  ];

  useEffect(() => {
    // console.log(id);
    if (open) {
      const getById = async () => {
        let response = await getCredsProfileById(rowId);
        console.log("rowid", rowId);
        const modifiedData = replaceDotsWithUnderscores(response.result);
        console.log("data-----------------", modifiedData);
        setData(modifiedData);
      };
      getById();

      const savedProtocolValue =
        data && data.credential_context && data.credential_context.snmp_version
          ? `${data.protocol}${data.credential_context.snmp_version}`
          : data && data.protocol;
      setProtocol(savedProtocolValue);
    }
  }, [open]);

  useEffect(() => {
    if (protocol == "SNMPV2C" || protocol == "SNMPV1") {
      setSnmpObject({
        name: data.name,
        protocol: "SNMP",
        credential_context: {
          snmp_version: data.credential_context.snmp_version,
          snmp_community: data.credential_context.snmp_community,
        },
      });
    } else if (protocol == "SNMPV3") {
      setSnmpv3Object({
        name: data.name,
        protocol: "SNMP",
        credential_context: {
          snmp_version: "v3",
          snmp_msg_flag: msg_flag,
          username: data.credential_context.username,
          authentication_password: data.credential_context.password,
          authentication_protocol: authType,
          privacy_protocol: encryptType,
          privacy_password: data.credential_context.privacy_password,
        },
      });
    } else if (protocol == "SSH") {
      setSSHObject({
        name: data.name,
        protocol: "SSH",
        credential_context: {
          username: data.credential_context.username,
          password: data.credential_context.password,
        },
        public_key: data.public_key,
        paraphase: data.paraphase,
      });
    }
  }, [protocol]);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setSnmpObject((prevSnmpObject) => ({
      ...prevSnmpObject,
      credential_context: {
        ...prevSnmpObject.credential_context,
        [name]: value,
      },
    }));
  };

  const handleNameChange = (event: any) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handlesnmpSave = async () => {
    // console.log("snmp object", snmpObject);
    const modifiedData = replaceUnderscoresWithDotsNested(data);
    console.log("snmp object", modifiedData);

    let response = await updateCredsProfile(modifiedData, modifiedData._id);
    console.log("updated", response);
    if (response.status == "success") {
      togglegetCredProfileApiState();
      handleDrawerClose();
      toast.success(response.status, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } else {
      toast.error(response.message, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const handleSSHSave = async () => {
    // console.log("snmp object", snmpObject);
    const modifiedData = replaceUnderscoresWithDotsNested(data);
    console.log("ssh object", modifiedData);

    let response = await updateCredsProfile(modifiedData, modifiedData._id);
    console.log("updated", response);
    if (response.status == "success") {
      togglegetCredProfileApiState();
      handleDrawerClose();
      toast.success(response.status, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } else {
      toast.error(response.message, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const handleSNMPv3Save = () => {
    // console.log("snmp object", snmpObject);
    const modifiedData = replaceUnderscoresWithDots(data);
    console.log("snmpv3 Object ", modifiedData);
    try {
      const createprofile = async () => {
        let response = await createCredsProfile(modifiedData);
        console.log(response);
        if (response.status == "success") {
          togglegetCredProfileApiState();
          toast.success(response.status, {
            position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        } else {
          toast.error(response.message, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        }
      };
      createprofile();
      setProtocol(null);
      // setSnmpObject({
      //   name: "",
      //   protocol: "SNMP",
      //   credential_context: {
      //     snmp_version: "",
      //     snmp_community: "",
      //   },
      // });
    } catch (error) {
      console.log(error);
    }
    handleDrawerClose();
  };

  const handleChange = (values: any) => {
    setMsgFlag("no.auth.no.priv");
    setProtocol(values);
    console.log("protocol------------------", values);
    let value = "";
    if (values == "SNMPV1") {
      value = "V1";
    } else {
      value = "V2C";
    }
    setSnmpObject((prevSnmpObject) => ({
      ...prevSnmpObject,
      credential_context: {
        ...prevSnmpObject.credential_context,
        snmp_version: value,
      },
    }));
  };

  const handleAuthChange = (values: any) => {
    setAuthType(values);
  };
  const handleFlagChange = (values: any) => {
    setMsgFlag(values);
  };
  const handleEncryptChange = (values: any) => {
    setEncryptType(values);
  };

  const handleInputSSHChange = (event: any) => {
    const { name, value } = event.target;
    setSSHObject((prevSshObject) => ({
      ...prevSshObject,
      credential_context: {
        ...prevSshObject.credential_context,
        [name]: value,
      },
    }));
  };
  const handleInputSnmpv3Change = (event: any) => {
    const { name, value } = event.target;
    setSnmpv3Object((prevSnmpv3Object) => ({
      ...prevSnmpv3Object,
      credential_context: {
        ...prevSnmpv3Object.credential_context,
        [name]: value,
      },
    }));
  };
  const handleFieldChange = (event: any) => {
    const { name, value } = event.target;
    setSSHObject({ ...sshObject, [name]: value });
  };
  console.log("prto", protocol);

  const handleSave = (event: any) => {
    event.preventDefault();
    console.log("click", event);
    // Choose the appropriate onSubmit method based on the protocol
    if (protocol == "SNMPV2C" || protocol == "SNMPV1") {
      handlesnmpSave();
    } else if (protocol === "SNMPV3") {
      handleSNMPv3Save();
    } else if (protocol === "SSH") {
      handleSSHSave();
    }
  };
  return (
    <Drawer
      anchor="right"
      open={props.open}
      variant="persistent"
      classes={{
        paper: classes.drawerPaper,
      }}
      className={`shadow-sm  shadow-dark-container ${classes.drawer}`}
    >
      <div className="h-full  dark:bg-dark-menu-color">
        <div className="flex justify-between py-3 px-10 border-b border-b-textColor dark:border-b-dark-border">
          <p className="text-primary2 font-semibold">Edit Credential Profile</p>
          <CloseSharpIcon
            className="cursor-pointer mr-3 dark:text-textColor"
            onClick={props.handleDrawerClose}
          />
        </div>
        <div className="py-8 px-6">
          <form onSubmit={handleSave}>
            <div className="flex">
              <CustomeInput
                label="Profile Name"
                name="name"
                value={data.name}
                onChange={handleNameChange}
                type="text"
                disable={false}
                require={true}
              />

              <SingleSelect
                label="Protocol"
                value={protocol}
                selectData={[
                  { value: "SNMPv1", label: "SNMPv1" },
                  { value: "SNMPv2c", label: "SNMPv2c" },
                  { value: "SNMPv3", label: "SNMPv3" },
                  { value: "SSH", label: "SSH" },
                ]}
                onChange={handleChange}
                require={false}
              />
            </div>

            {protocol == "SNMPV2C" || protocol == "SNMPV1" ? (
              <div className="">
                <CustomeInput
                  label="Community"
                  name="snmp_community"
                  value={snmpObject.credential_context.snmp_community}
                  onChange={handleInputChange}
                  type="text"
                  disable={false}
                  require={true}
                />
              </div>
            ) : protocol == "SNMPV3" ? (
              <div className="">
                <div className="flex flex-col">
                  <div className="flex">
                    {/* <div className="flex flex-col items-start mx-2"> */}
                    <CustomeInput
                      label="UserName"
                      name="username"
                      value={snmpv3Object.credential_context.username}
                      onChange={handleInputSnmpv3Change}
                      type="text"
                      disable={false}
                      require={true}
                    />{" "}
                    {/* </div> */}
                    {/* <div className="flex flex-col items-start mx-2"> */}
                    <SingleSelect
                      label="Security"
                      selectData={msg_flag_values}
                      onChange={handleFlagChange}
                      // require={true}
                    />
                    {/* </div> */}
                  </div>
                  {msg_flag === "auth.priv" ? (
                    <div>
                      <div className="flex">
                        {/* <div className="flex flex-col items-start mx-2"> */}
                        <SingleSelect
                          label="Authentication Protocol"
                          selectData={[
                            { value: "MD5", label: "MD5" },
                            { value: "SHA", label: "SHA" },
                            // { value: "SNMPv3", label: "SNMPv3" },
                            // { value: "SSH", label: "SSH" },
                          ]}
                          onChange={handleAuthChange}
                          require={false}
                        />
                        {/* </div>
                        <div className="flex flex-col items-start mx-2"> */}
                        <CustomeInput
                          label="Authentication Password"
                          name="authentication_password"
                          value={
                            snmpv3Object.credential_context
                              .authentication_password
                          }
                          onChange={handleInputSnmpv3Change}
                          type="password"
                          disable={false}
                          require={true}
                        />
                        {/* </div> */}
                      </div>
                      <div className="flex">
                        {/* <div className="flex flex-col items-start mx-2"> */}
                        <SingleSelect
                          label="Privacy Protocol"
                          selectData={[
                            { value: "AES", label: "AES" },
                            { value: "DES", label: "DES" },
                            // { value: "SNMPv3", label: "SNMPv3" },
                            // { value: "SSH", label: "SSH" },
                          ]}
                          onChange={handleEncryptChange}
                          require={false}
                        />
                        {/* </div>
                        <div className="flex flex-col items-start mx-2"> */}
                        <CustomeInput
                          label="Privacy Password"
                          name="privacy_password"
                          value={
                            snmpv3Object.credential_context.privacy_password
                          }
                          onChange={handleInputSnmpv3Change}
                          type="password"
                          disable={false}
                          require={true}
                        />
                        {/* </div> */}
                      </div>
                    </div>
                  ) : msg_flag === "auth.no.priv" ? (
                    <div className="flex">
                      {/* <div className="flex flex-col items-start mx-2"> */}
                      <SingleSelect
                        label="Authentication Protocol"
                        selectData={[
                          { value: "MD5", label: "MD5" },
                          { value: "SHA", label: "SHA" },
                          // { value: "SNMPv3", label: "SNMPv3" },
                          // { value: "SSH", label: "SSH" },
                        ]}
                        onChange={handleAuthChange}
                        require={false}
                      />
                      {/* </div>
                      <div className="flex flex-col items-start mx-2"> */}
                      <CustomeInput
                        label="Authentication Password"
                        name="authentication_password"
                        value={
                          snmpv3Object.credential_context
                            .authentication_password
                        }
                        onChange={handleInputSnmpv3Change}
                        type="password"
                        disable={false}
                        require={true}
                      />
                      {/* </div> */}
                    </div>
                  ) : (
                    " "
                  )}
                </div>
                {/* <div className=" fixed bottom-0 right-0 p-2 flex justify-end mt-6">
                <div >
                  <SubmitButton title="Save" />
=======
                <div className=" fixed bottom-0 right-0 p-2 flex justify-end mt-6">
                  <div onClick={handleSNMPv3Save}>
                    <CustomeButton title="Save" />
                  </div>
                  <div onClick={handleDrawerClose}>
                    <CustomeCancelButton title="Cancel" />
                  </div>
>>>>>>> 0e618d9e17126d169343e0de3ab4e0f295a54a17
=======
                {/* <div className=" fixed bottom-0 right-0 p-2 flex justify-end mt-6">
                <div >
                  <SubmitButton title="Save" />
>>>>>>> 9d21edaa32b8f16f82625b7dfcc4aa495893304f
                </div>
                <div>
                  <CustomeCancelButton title="Cancel" />
                </div>
              </div> */}
              </div>
            ) : protocol == "SSH" ? (
              <div>
                <div className="flex flex-col">
                  <div className="flex">
                    <CustomeInput
                      label="UserName"
                      name="username"
                      value={sshObject.credential_context.username}
                      onChange={handleInputSSHChange}
                      type="text"
                      disable={false}
                      require={true}
                    />
                    <CustomeInput
                      label="Password"
                      name="password"
                      value={sshObject.credential_context.password}
                      onChange={handleInputSSHChange}
                      type="password"
                      disable={false}
                      require={true}
                    />
                  </div>
                  <div className="flex">
                    <CustomeInput
                      label="SSH Public Key"
                      name="public_key"
                      value={sshObject.public_key}
                      onChange={handleFieldChange}
                      type="text"
                      disable={false}
                      require={true}
                    />
                    <CustomeInput
                      label="Paraphrase"
                      name="paraphase"
                      value={sshObject.paraphase}
                      onChange={handleFieldChange}
                      type="text"
                      disable={false}
                      require={true}
                    />
                  </div>
                </div>

                {/* <div className="fixed bottom-0 right-0 p-2 flex justify-end mt-6">
                  <div >
                    <SubmitButton title="Save" />
                  </div>
                  <div onClick={handleDrawerClose}>
                    <CustomeCancelButton title="Cancel" />
                  </div>
                </div> */}
              </div>
            ) : (
              ""
            )}
            <div className=" fixed bottom-0 right-0 p-2 flex justify-end mt-6">
              <div>
                {/* <SubmitButton title="Save" /> */}
                <button
                  className=" mx-2 inline-flex items-center justify-center rounded-md py-1 px-6 text-center font-medium text-white bg-primary2 hover:bg-opacity-90 lg:px-6 xl:px-6 cursor-pointer"
                  type="submit"
                >
                  save
                </button>
              </div>
              <div onClick={handleDrawerClose}>
                <CustomeCancelButton title="Cancel" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </Drawer>
  );
};

export default EditCredentialProfileDrawer;
