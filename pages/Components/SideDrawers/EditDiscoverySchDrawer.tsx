import React, { useEffect, useState } from "react";
import { Box, Drawer } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { Bounce, toast } from "react-toastify";
import { CustomProvider, DatePicker, DateRangePicker } from "rsuite";
import Button from "@mui/material/Button";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import CustomeInput, { DateInput } from "../Inputs";
import { ButtonGroup } from "@mui/material";
import { CustomeCancelButton } from "../Buttons";
import { useAppContext } from "../AppContext";
import "rsuite/dist/rsuite.min.css";
import {
  getDiscoverySchById,
  updateDiscSch,
} from "@/pages/api/api/DiscoveryScheduleAPI";
import {
  isObjectEqual,
  replaceDotsWithUnderscores,
  replaceDotsWithUnderscoresSec,
  replaceUnderscoresWithDots,
  replaceDotWithUnderscore2,
} from "@/functions/genericFunctions";
import { getAllGropus } from "@/pages/api/api/GroupsAPI";
import { getAllDevice } from "@/pages/api/api/DeviceManagementAPI";
import SingleSelect from "../Selects";
import TimeRangePicker from "../TimeRnangePicker";
const useStyles = makeStyles(() => ({
  drawer: {
    width: "60%",
  },
}));
const EditDiscoverySchDrawer = (props: any) => {
  const { open, handleDrawerClose, id } = props;
  const classes = useStyles();
  const [selection, setSelection] = React.useState("");
  const [frequency, setFrequency] = React.useState("");
  const [timeArray, setTimeArray] = React.useState<any>([]);
  const [selectedGroupValue, setSelectedGroupValue] = React.useState<any>([]);
  const [date, setDate] = React.useState<any>([]);
  const [selectedDeviceValue, setSelectedDeviceValue] = React.useState<any>([]);
  const [selectedTimeValue, setSelectedTimeValue] = React.useState<any>([]);
  const [schedulerContext, setSchedulerContext] = useState({}) as any;
  const [selectedDaysValue, setSelectedDaysValue] = React.useState<any>([]);
  const [selectedDatesValue, setSelectedDatesValue] = React.useState<any>([]);
  const { themeSwitch, togglegetDisSchedApiState } = useAppContext();
  const [data, setData] = React.useState<any>({
    entities: [""],
    entity_type: "",
    name: "",
    email: [""],
    // message: "",
    scheduler_context_updated: "no",
    scheduler_context: {
      scheduled_times: [""],
      cron: "0 */2 * ? * *",
      start_date: "",
      frequency: "",
    },
  });
  const [activeButton, setActiveButton] = React.useState<string | null>(
    "DEVICE"
  );
  const [frequencyButton, setFrequencyButton] = React.useState<string | null>(
    "CUSTOME"
  );
  const isBrowser = typeof window !== "undefined";
  const [colorTheme, setColorTheme] = useState<any>(
    isBrowser ? localStorage.getItem("color-theme") : null
  );

  const [allGroups, setAllGroups] = React.useState([]);
  const [allDevices, setAllDevices] = React.useState([]);
  const daysOfWeek = [
    { value: "Sunday", label: "Sunday" },
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
  ];
  const groupValues = allGroups.map((item: any) => ({
    label: item.name,
    value: item._id,
  }));
  const deviceValues = allDevices.map((item: any) => ({
    label: item.hostname,
    value: item._id,
  }));

  const datesOfMonth = Array.from({ length: 31 }, (_, index) => ({
    label: index + 1,
    value: (index + 1).toString(),
  }));
  React.useEffect(() => {
    if (open) {
      try {
        const getDiscoveryShById = async () => {
          let response = await getDiscoverySchById(id);
          //   console.log("Get by Id ---result", response.result);
          const modifiedData = replaceDotWithUnderscore2(response.result);
          //  console.log("mod data getById----", modifiedData);

          setData(modifiedData);
          setSchedulerContext(modifiedData.scheduler_context);
          setActiveButton(modifiedData.entity_type);
          setSelection(modifiedData.entity_type);
          setFrequencyButton(modifiedData.scheduler_context?.frequency);
          setFrequency(modifiedData.scheduler_context?.frequency);
        };
        getDiscoveryShById();
      } catch (error) {
        console.log(error);
      }
    }
  }, [id, open]);

  useEffect(() => {
   // console.log("schedulr context", schedulerContext);
  }, [schedulerContext]);
  // console.log("device",data.scheduler_context.start_date);
  useEffect(() => {
    if (data && data.entity_type === "DEVICE") {
      data.entities && setSelectedDeviceValue(data.entities);
    }
    if (data && data.entity_type === "GROUP") {
      data.entities && setSelectedGroupValue(data.entities);
    }
    if (data && data.scheduler_context) {
      data.scheduler_context.days_of_week &&
        setSelectedDaysValue(data.scheduler_context.days_of_week);
      data.scheduler_context.days_of_month &&
        setSelectedDatesValue(data.scheduler_context.days_of_month);
      data.scheduler_context.scheduled_times &&
        setSelectedTimeValue(data.scheduler_context.scheduled_times);
    }
  }, [data]);

  useEffect(() => {
    // const handleStorageChange = () => {
    const newColorTheme = localStorage.getItem("color-theme");

    setColorTheme(newColorTheme);
    // };
    // handleStorageChange();
  }, [themeSwitch]);

  React.useEffect(() => {
    const time = generateTimeArray();
    const transformedArray = time.map((time) => ({
      value: time,
      label: time,
    }));
    setTimeArray(transformedArray);
    //console.log("timearray", timeArray);
    const getGroups = async () => {
      let response = await getAllGropus();
      setAllGroups(response.result);
    };
    getGroups();
    const getDevices = async () => {
      let response = await getAllDevice();
      setAllDevices(response.result);
    };
    getDevices();
  }, []);

  const generateTimeArray = () => {
    const times = [];

    for (let hours = 0; hours < 24; hours++) {
      for (let minutes = 0; minutes < 60; minutes += 5) {
        const formattedHours = hours.toString().padStart(2, "0");
        const formattedMinutes = minutes.toString().padStart(2, "0");
        const time = `${formattedHours}:${formattedMinutes}`;
        times.push(time);
      }
    }

    return times;
  };
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };
  const handleEmailChange = (event: any) => {
    const newEmailValue = event.target.value;
    const emailArray = newEmailValue.split(",");

    setData((prevData: any) => ({
      ...prevData,
      email: emailArray,
    }));
  };
  const handleButtonClick = (value: any) => {
    setSelection(value);
    setActiveButton(value);
    setData({ ...data, entity_type: value });
  };

  const handleEntities = (values: any) => {
    // console.log(values);
    setData({
      ...data,
      entities: values,
    });
  };

  const handleFrequency = (values: any) => {
    setData((prevSnmpObject: any) => ({
      ...prevSnmpObject,
      scheduler_context: {
        ...prevSnmpObject.scheduler_context,
        scheduled_times: values,
      },
    }));
  };
  const handleWeeklyFrequency = (values: any) => {
    setData((prevSnmpObject: any) => ({
      ...prevSnmpObject,
      scheduler_context: {
        ...prevSnmpObject.scheduler_context,
        days_of_week: values,
      },
    }));
  };

  const handleMonthlyFrequency = (values: any) => {
    const selectedValues = values.map((option: any) => option.value);
    setData((prevSnmpObject: any) => ({
      ...prevSnmpObject,
      scheduler_context: {
        ...prevSnmpObject.scheduler_context,
        // days_of_month: selectedValues,
        days_of_month: values,
      },
    }));
  };
  const handleCronChange = (event: any) => {
    const { value } = event.target;
    setData((prevData: any) => ({
      ...prevData,
      scheduler_context: {
        ...prevData.scheduler_context,
        cron: value,
      },
    }));
  };

  const handleFrequencyClick = (value: any) => {
    setFrequency(value);
    //  console.log("fre", value);
    if (value === "WEEKLY") {
      setData((prevState: any) => {
        const { days_of_month, ...restSchedulerContext } =
          prevState.scheduler_context;

        const updatedSchedulerContext = {
          ...restSchedulerContext,
          days_of_week: selectedDaysValue,
        };

        return {
          ...prevState,
          scheduler_context: updatedSchedulerContext,
        };
      });
    } else if (value === "MONTHLY") {
      setData((prevState: any) => {
        const { days_of_week, ...restSchedulerContext } =
          prevState.scheduler_context;

        const updatedSchedulerContext = {
          ...restSchedulerContext,
          days_of_month: selectedDatesValue,
        };

        return {
          ...prevState,
          scheduler_context: updatedSchedulerContext,
        };
      });
    }
    setFrequencyButton(value);
    setData((prevSnmpObject: any) => ({
      ...prevSnmpObject,
      scheduler_context: {
        ...prevSnmpObject.scheduler_context,
        frequency: value,
      },
    }));
  };
  //console.log("df",data.scheduler_context.start_date);
  // const handleDate = (event: any) => {
  //   let updatedPayload: any = { ...data };

  //   if (event.label !== "custom") {
  //     delete updatedPayload.start_timestamp;
  //     delete updatedPayload.end_timestamp;
  //     updatedPayload = {
  //       ...updatedPayload,
  //       time_range: event.text,
  //     };
  //   } else {
  //     const startdate = new Date(event.value[0]);
  //     const startepochTime = startdate.getTime() / 1000;
  //     const enddate = new Date(event.value[1]);
  //     const endepochTime = enddate.getTime() / 1000;
  //     updatedPayload = {
  //       ...updatedPayload,
  //       time_range: event.text,
  //       start_timestamp: startepochTime,
  //       end_timestamp: endepochTime,
  //     };
  //   }
  //   setData(updatedPayload);
  // };
  const handleDate = (values: any) => {
  
    const date = new Date(values);
    const epochTime = date.getTime() / 1000;
    
    setData((prevSnmpObject: any) => ({
      ...prevSnmpObject,
      scheduler_context: {
        ...prevSnmpObject.scheduler_context,
        start_date: epochTime,
      },
    }));
  };


  const handleSave = async (event: any) => {
    event.preventDefault();
    const areEqual = isObjectEqual(data.scheduler_context, schedulerContext);
    if (!areEqual) {
      data.scheduler_context_updated = "yes";
    }
    const modifiedData = replaceUnderscoresWithDots(data);
    // console.log("modifiedData for discovery", modifiedData);
    const entitiesArray = Object.values(modifiedData.entities);
    modifiedData.entities = entitiesArray;
    1;
    let response = await updateDiscSch(modifiedData, id);
    // console.log("updated", response);
    if (response.status == "success") {
      togglegetDisSchedApiState();
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
  return (
    <Drawer
      // hideBackdrop = {false}temporary
      anchor="right"
      open={props.open}
      // transitionDuration
      // className={classes.drawer}
      variant="temporary"
      classes={{ paper: classes.drawer }}
      className={`shadow-sm shadow-dark-container w-full overflow-y-auto ${classes.drawer}`}
    >
      <div className="h-full bg-white dark:bg-dark-menu-color px-4">
        <div className="flex justify-between py-3 px-10 border-b border-b-textColor dark:border-b-dark-border">
          <p className="text-primary2 font-semibold">
            {" "}
            Edit Discovery Scheduler{" "}
          </p>
          <CloseSharpIcon
            className="cursor-pointer mr-3 dark:text-textColor"
            onClick={handleDrawerClose}
          />
        </div>

        <form onSubmit={handleSave} method="POST">
          <div className="flex flex-col">
            <div className="mt-4">
              <CustomeInput
                label="Scheduler Name"
                name="name"
                value={data.name}
                onChange={handleInputChange}
                type="text"
                disable={false}
                require={true}
              />
            </div>
            <div className="flex">
              <Box>
                <ButtonGroup
                  variant="outlined"
                  aria-label="Basic button group"
                  className="my-4 mx-4 items-center"
                >
                  <Button
                    // className={`dark:text-textColor border-primary2 px-[2.75rem] rounded-lg ${
                    //   activeButton == "GROUP" &&
                    //   "bg-primary2 hover:bg-primary2 text-white"
                    // }`}
                    onClick={() => {
                      handleButtonClick("DEVICE");
                    }}
                    style={{
                      width: "145px",
                      backgroundColor:
                        activeButton === "DEVICE" ? "#0078d4" : "",

                      color: activeButton === "DEVICE" ? "white" : "",
                    }}
                  >
                    Device
                  </Button>
                  <Button
                    // className={`dark:text-textColor border-primary2 px-[2.75rem] rounded-lg ${
                    //   activeButton == "GROUP" &&
                    //   "bg-primary2 hover:bg-primary2 text-white"
                    // }`}
                    onClick={() => {
                      handleButtonClick("GROUP");
                    }}
                    style={{
                      width: "145px",
                      backgroundColor:
                        activeButton === "GROUP" ? "#0078d4" : "",
                      color: activeButton === "GROUP" ? "white" : "",
                    }}
                  >
                    Group
                  </Button>
                </ButtonGroup>
              </Box>
              <div className="px-4">
                {selection == "DEVICE" ? (
                  <SingleSelect
                    label="Select Devices"
                    isMulti={true}
                    value={deviceValues.filter(
                      (option) =>
                        selectedDeviceValue &&
                        selectedDeviceValue.includes(option.value)
                    )}
                    selectData={deviceValues}
                    onChange={handleEntities}
                  />
                ) : (
                  <SingleSelect
                    label="Select Groups"
                    isMulti={true}
                    value={groupValues.filter(
                      (option) =>
                        selectedGroupValue &&
                        selectedGroupValue.includes(option.value)
                    )}
                    selectData={groupValues}
                    onChange={handleEntities}
                  />
                )}
              </div>
            </div>

            <div>
              <h5 className="mx-4 mt-2 font-normal dark:text-textColor">
                Notify To
              </h5>
              <CustomeInput
                style={{ marginTop: "10px" }}
                label="Email"
                name="email"
                value={data.email}
                onChange={handleEmailChange}
                type="email"
                disable={false}
              />
            </div>

            <div className="mx-3 py-2">
              <h5 className="mb-4 font-normal dark:text-textColor">Schedule</h5>
              {/* <TimeRangePicker
                showOneCalendar={true}
                onTimeRangeChange={handleDate}
              /> */}
              {/* <CustomProvider theme="dark"> */}
                <DatePicker
                  onChange={handleDate}
                  // showOneCalendar
                  value={data.scheduler_context.start_date ? new Date(data.scheduler_context.start_date * 1000) : null}
                  appearance="subtle"
                  placement="rightStart"
                  style={{
                    // margin: "1rem 1rem",
                    width: "19rem",
                   // height: "max-content",
                    border:
                      colorTheme == "light"
                        ? "1px solid #e5e7eb"
                        : "1px solid #ccc",
                    padding: ".4rem",
                  }}
                  placeholder="Select Date "
                   format="yyyy-MM-dd"
                  className="rounded-lg   dark:hover:bg-transparent dark:text-textColor dark:bg-dark-menu-color z-50"
                />
              {/* </CustomProvider> */}

            </div>
            <div className="flex items-center">
              <Box>
                <ButtonGroup
                  variant="outlined"
                  aria-label="Basic button group"
                  className="my-5 mx-4 mr-7"
                >
                  <Button
                    // className={`dark:text-textColor border-primary2 px-[5px] py-2.5 rounded-lg ${
                    //   frequencyButton == "CUSTOME" &&
                    //   "bg-primary2 hover:bg-primary2 text-white"
                    // }`}
                    onClick={() => handleFrequencyClick("CUSTOME")}
                    style={{
                      width: "75px",
                      backgroundColor:
                        frequencyButton === "CUSTOME" ? "#0078d4" : "",
                      color: frequencyButton === "CUSTOME" ? "white" : "",
                    }}
                  >
                    Custom
                  </Button>
                  <Button
                    // className={`dark:text-textColor border-primary2 px-[5px] py-2.5 rounded-lg ${
                    //   frequencyButton == "DAILY" &&
                    //   "bg-primary2 hover:bg-primary2 text-white"
                    // }`}
                    style={{
                      width: "65px",
                      backgroundColor:
                        frequencyButton === "DAILY" ? "#0078d4" : "",
                      color: frequencyButton === "DAILY" ? "white" : "",
                    }}
                    onClick={() => handleFrequencyClick("DAILY")}
                  >
                    Daily
                  </Button>
                  <Button
                    // className={`dark:text-textColor border-primary2 px-[5px] py-2.5 rounded-lg ${
                    //   frequencyButton == "WEEKLY" &&
                    //   "bg-primary2 hover:bg-primary2 text-white"
                    // }`}
                    style={{
                      width: "75px",
                      backgroundColor:
                        frequencyButton === "WEEKLY" ? "#0078d4" : "",
                      color: frequencyButton === "WEEKLY" ? "white" : "",
                    }}
                    onClick={() => handleFrequencyClick("WEEKLY")}
                  >
                    Weekly
                  </Button>
                  <Button
                    style={{
                      width: "85px",
                      backgroundColor:
                        frequencyButton === "MONTHLY" ? "#0078d4" : "",
                      color: frequencyButton === "MONTHLY" ? "white" : "",
                    }}
                    // className={`dark:text-textColor border-primary2 px-[5px] py-2.5 rounded-lg ${
                    //   frequencyButton == "MONTHLY" &&
                    //   "bg-primary2 hover:bg-primary2 text-white"
                    // }`}
                    onClick={() => handleFrequencyClick("MONTHLY")}
                  >
                    Monthly
                  </Button>
                </ButtonGroup>
              </Box>
              {frequency == "CUSTOME" ? (
                <CustomeInput
                  label="Cron Value"
                  name="cron"
                  value={data.scheduler_context.cron}
                  onChange={handleCronChange}
                  type="text"
                  disable={false}
                />
              ) : frequency == "DAILY" ? (
                <SingleSelect
                  label="Select Hours"
                  isMulti={true}
                  width={150}
                  value={timeArray.filter(
                    (day: { value: any }) =>
                      selectedTimeValue && selectedTimeValue.includes(day.value)
                  )}
                  selectData={timeArray}
                  onChange={handleFrequency}
                />
              ) : frequency == "WEEKLY" ? (
                <>
                  <SingleSelect
                    label="Select Hours"
                    isMulti={true}
                    width={150}
                    selectData={timeArray}
                    value={timeArray.filter(
                      (day: { value: any }) =>
                        selectedTimeValue &&
                        selectedTimeValue.includes(day.value)
                    )}
                    onChange={handleFrequency}
                  />
                  <SingleSelect
                    label="Select Days"
                    isMulti={true}
                    width={150}
                    value={daysOfWeek.filter(
                      (day) =>
                        selectedDaysValue &&
                        selectedDaysValue.includes(day.value)
                    )}
                    selectData={daysOfWeek}
                    onChange={handleWeeklyFrequency}
                  />
                </>
              ) : frequency == "MONTHLY" ? (
                <>
                  <SingleSelect
                    label="Select Hours"
                    isMulti={true}
                    width={150}
                    selectData={timeArray}
                    value={timeArray.filter(
                      (day: { value: any }) =>
                        selectedTimeValue &&
                        selectedTimeValue.includes(day.value)
                    )}
                    onChange={handleFrequency}
                  />
                  <SingleSelect
                    label="Select Dates"
                    isMulti={true}
                    width={150}
                    selectData={datesOfMonth}
                    value={datesOfMonth.filter(
                      (day) =>
                        selectedDatesValue &&
                        selectedDatesValue.includes(day.value)
                    )}
                    // value={datesOfMonth.find(
                    //   (option) => option.value === selectedDatesValue
                    // )}
                    onChange={handleMonthlyFrequency}
                  />
                </>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="fixed bottom-0 right-0 p-2 flex justify-end mt-6">
            <div>
              {/* <SubmitButton title="Save" /> */}
              <button
                className=" mx-2 inline-flex items-center justify-center rounded-md py-1 px-6 text-center font-medium text-white bg-primary2 hover:bg-opacity-90 lg:px-6 xl:px-6 cursor-pointer"
                type="submit"
              >
                Update
              </button>
            </div>
            <div onClick={handleDrawerClose}>
              <CustomeCancelButton title="Cancel" />
            </div>
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export default EditDiscoverySchDrawer;
