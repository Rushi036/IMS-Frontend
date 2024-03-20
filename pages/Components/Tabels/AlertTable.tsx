import React, { useState, useEffect } from "react";
import {
  InputBase,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  TableSortLabel,
  Tooltip,
  Button,
  ButtonGroup,
} from "@mui/material";
import Zoom from "@mui/material/Zoom";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Bounce, toast } from "react-toastify";
import { useAppContext } from "../AppContext";
import {
  bulkActionDeviceDelete,
  getAllDevice,
  runDiscovery,
} from "@/pages/api/api/DeviceManagementAPI";
import { getAllGropus } from "@/pages/api/api/GroupsAPI";
import { getAllDiscoverySch } from "@/pages/api/api/DiscoveryScheduleAPI";
import { getAllCredsProfile } from "@/pages/api/api/CredentialProfileAPI";
import {
  convertEpochToDateMonthYear,
  convertEpochToDateMonthYearTwo,
  replaceDotsWithUnderscores,
  replaceUnderscoresWithDots,
} from "@/functions/genericFunctions";
import AddSingleDeviceDrawer from "../SideDrawers/AddDeviceDrawer";
import CustomeButton, { CustomeButtonGroupButton } from "../Buttons";
import { StatusChips } from "../Chips";
import DeleteModal from "../Modals/DeleteModal";
import AssetsActionMenu from "../ActionMenu/AssetActionMenu";
import AllDeviceMenu from "../ActionMenu/AllDeviceMenu";
import UploadCSVDrawer from "../SideDrawers/UploadCSV";
import Link from "next/link";
import DiscoveryContext from "../Modals/DiscoveryContextModal";
import SingleSelect from "../Selects";
import SmallSingleSelect from "../Selects/smallSingleSelect";
import { CustomProvider, DatePicker, DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";

import moment from "moment";
import { getAllPolicy } from "@/pages/api/api/PolicyApi";
import { useWebSocketContext } from "../WebSocketContext";
import TimeRangePicker from "../TimeRnangePicker";
const AlertTable = (props: any) => {
  const {
    data,
    visibleColumns,
    setVisibleColumns,
    columns,
    page,
    rowsPerPage,
  } = props;
  // console.log("-----data-------", data);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("hostname");
  const [search, setSearch] = useState("");
  const [deviceIds, setDeviceIds] = useState() as any;
  const { toggleDeviceTableState, activeButton, toggleActiveButton } =
    useAppContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedButtons, setSelectedButtons] = useState([]) as any;
  const [allPolicies, setAllPolicies] = React.useState([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [allDevices, setAllDevices] = React.useState([]);
  const [allGroups, setAllGroups] = React.useState([]);
  const [payloadForAlert, setpayloadForAlert] = React.useState({
    time_range: "",
    start_timestamp: 0,
    end_timestamp: 0,
    filters: {
      device_filter: {
        entity_type: "device",
        entities: [],
      },
      pre_filters: [
        {
          filter_type: "equals",
          indicator: "severity",
          values: [],
        },
        {
          filter_type: "equals",
          indicator: "policy",
          values: [],
        },
        {
          filter_type: "equals",
          indicator: "status",
          values: [],
        },
      ],
      post_filters: [],
    },
  });
  const [selected, setSelected] = useState(false);
  const [anchorE3, setAnchorE3] = useState(null);
  const [anchorE2, setAnchorE2] = useState<null | HTMLElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCSVDrawerOpen, setICSVDrawerOpen] = useState(false);
  const [isModalopen, setIsModalOpen] = React.useState(false);
  const [isContextModalopen, setIsContextModalOpen] = React.useState(false);
  //   const [activeButton, setActiveButton] = React.useState<string | null>("live");
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const { Subscribe, emit, connection } = useWebSocketContext();

  const handleContextModalOpen = (rowId: any) => {
    setIsContextModalOpen(rowId);
  };

  const handleContextModalClose = () => setIsContextModalOpen(false);
  const [receivedData, setReceivedData] = React.useState<any>([]);

  //--------------------------------------code required for DateRangePicker-----------------------------
  const { time, toggleTime } = useAppContext();
  const { timeEnd, toggleTimeEnd } = useAppContext();
  const [timePeriod, setTimePeriod] = React.useState<any>([
    new Date(time),
    new Date(timeEnd),
  ]);
  const today = moment();
  // console.log("date", timePeriod);
  const financialYearStartMonth = 3;
  let financialYearStart;
  let financialYearEnd;
  if (today.month() < financialYearStartMonth) {
    financialYearStart = moment()
      .subtract(1, "year")
      .month(financialYearStartMonth)
      .startOf("month")
      .hour(15)
      .minute(30)
      .second(0)
      .millisecond(0);
    financialYearEnd = today.hour(15).minute(30).second(0).millisecond(0);
  } else {
    financialYearStart = moment()
      .month(financialYearStartMonth)
      .startOf("month")
      .hour(15)
      .minute(30)
      .second(0)
      .millisecond(0);
    financialYearEnd = today.hour(15).minute(30).second(0).millisecond(0);
  }
  const predefinedRanges: any = [
    {
      label: "Last day",

      value: [
        new Date(moment().subtract(1, "day").format("YYYY-MM-DDTHH:mm:ss")),
        new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
      ],

      placement: "left",
    },

    {
      label: "Last 7 days",

      value: [
        new Date(moment().subtract(7, "day").format("YYYY-MM-DDTHH:mm:ss")),
        new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
      ],

      placement: "left",
    },

    {
      label: "Last 15 days",

      value: [
        new Date(moment().subtract(15, "day").format("YYYY-MM-DDTHH:mm:ss")),
        new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
      ],

      placement: "left",
    },

    {
      label: "Last 30 days",

      value: [
        new Date(moment().subtract(30, "day").format("YYYY-MM-DDTHH:mm:ss")),
        new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
      ],

      placement: "left",
    },

    {
      label: "Last 90 days",

      value: [
        new Date(moment().subtract(90, "day").format("YYYY-MM-DDTHH:mm:ss")),
        new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
      ],

      placement: "left",
    },
    {
      label: "Last 120 days",

      value: [
        new Date(moment().subtract(120, "day").format("YYYY-MM-DDTHH:mm:ss")),
        new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
      ],

      placement: "left",
    },
    {
      label: "Last 180 days",

      value: [
        new Date(moment().subtract(180, "day").format("YYYY-MM-DDTHH:mm:ss")),
        new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
      ],

      placement: "left",
    },
    {
      label: "Current FY",
      value: [
        new Date(financialYearStart.format("YYYY-MM-DDTHH:mm:ss")),
        new Date(financialYearEnd.format("YYYY-MM-DDTHH:mm:ss")),
      ],
      placement: "left",
    },
  ];
  const { afterToday }: any = DateRangePicker;

  //-----------------------------code required for DateRangePicker ENDS-----------------------------

  const groupValues =
    allGroups &&
    allGroups.map((item: any) => ({
      label: item.name,
      value: item._id,
    }));
  const deviceValues =
    allDevices &&
    allDevices.map((item: any) => ({
      label: item.hostname,
      value: item._id,
    }));
  const policyValues =
    allPolicies &&
    allPolicies.map((item: any) => ({
      label: item.name,
      value: item._id,
    }));

  // console.log("policies", allPolicies);
  // console.log("devices", allDevices);
  React.useEffect(() => {
    const getAllPolicies = async () => {
      let response = await getAllPolicy();
      setAllPolicies(replaceDotsWithUnderscores(response.result));
    };
    getAllPolicies();
    const getDevices = async () => {
      let response = await getAllDevice();
      setAllDevices(response.result);
    };
    getDevices();
    const getGroups = async () => {
      let response = await getAllGropus();
      setAllGroups(response.result);
    };
    getGroups();
    const getDiscoveryScheduler = async () => {
      let response = await getAllDiscoverySch();
      // setAllDiscoverySch(response.result);
    };
    // getDiscoveryScheduler();
  }, []);
  // console.log("policy data", allPolicies);
  const handleRequestSort = (property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearchChange = (event: any) => {
    setSearch(event.target.value);
  };

  const handleColumnToggle = (columnField: any) => {
    setVisibleColumns((prevVisibleColumns: any) => {
      if (prevVisibleColumns.includes(columnField)) {
        return prevVisibleColumns.filter((field: any) => field !== columnField);
      } else {
        return [...prevVisibleColumns, columnField];
      }
    });
  };

  const handleRowCheckboxToggle = (rowId: any) => {
    setSelectedRows((prevSelectedRows: any) => {
      if (prevSelectedRows.includes(rowId)) {
        return prevSelectedRows.filter((id: any) => id !== rowId);
      } else {
        return [...prevSelectedRows, rowId];
      }
    });
  };

  const handleSelectAllCheckboxToggle = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      const allRowIds = data
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((row: any) => row._id);
      // console.log("allrow ids", allRowIds);
      setSelectedRows(allRowIds);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (selectedRows.length != 0) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [selectedRows]);

  const downloadCSV = () => {
    const selectedRowsData = data.filter((row: any) =>
      selectedRows.includes(row._id)
    );

    const csvData = [Object.keys(selectedRowsData[0])]; // Header

    selectedRowsData.forEach((row: any) => {
      const rowData: any = Object.values(row);
      csvData.push(rowData);
    });

    const csvContent = csvData.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const filteredData =
    data &&
    data.filter((row: any) => {
      const matchesSearch = visibleColumns.some(
        (columnField: any) =>
          typeof row[columnField] === "string" &&
          row[columnField].toLowerCase().includes(search.toLowerCase())
      );

      const matchesButtons =
        selectedButtons.length === 0 ||
        selectedButtons.some((button: any) => row["plugin_type"] === button);
      // console.log("matched button", row["plugin_type"]);
      return matchesSearch && matchesButtons;
      //   return matchesSearch;
    });

  const handleButtonClick = (title: any) => {
    setSelectedButtons((prevSelectedButtons: any) => {
      if (prevSelectedButtons.includes(title)) {
        return prevSelectedButtons.filter((button: any) => button !== title);
      } else {
        return [...prevSelectedButtons, title];
      }
    });
  };

  const handleToggleButtonClick = (value: any) => {
    // setChange(!change);
    // setSelection(value);
    toggleActiveButton(value);
    if (value == "historic") {
      setpayloadForAlert({
        time_range: "",
        start_timestamp: 0,
        end_timestamp: 0,
        filters: {
          device_filter: {
            entity_type: "device",
            entities: [],
          },
          pre_filters: [
            {
              filter_type: "equals",
              indicator: "severity",
              values: [],
            },
            {
              filter_type: "equals",
              indicator: "policy",
              values: [],
            },
            {
              filter_type: "equals",
              indicator: "status",
              values: [],
            },
          ],
          post_filters: [],
        },
      });
    }
    // setData({ ...data, entity_type: value, entities: [] });
  };
  const handleResetButtonClick = () => {
    setSelectedButtons([]);
  };

  const handleSeverity = (value: any) => {
    setpayloadForAlert((prevData: any) => ({
      ...prevData,
      filters: {
        ...prevData.filters,
        pre_filters: prevData.filters["pre_filters"].map((filter: any) =>
          filter.indicator === "severity"
            ? { ...filter, values: [value] }
            : filter
        ),
      },
    }));
  };

  const handleDevice = (value: any) => {
    setpayloadForAlert((prevData: any) => ({
      ...prevData,
      filters: {
        ...prevData.filters,
        device_filter: {
          ...prevData.filters["device_filter"],
          entities: [value],
        },
      },
    }));
  };

  const handleStatus = (value: any) => {
    setpayloadForAlert((prevData: any) => ({
      ...prevData,
      filters: {
        ...prevData.filters,
        pre_filters: prevData.filters["pre_filters"].map((filter: any) =>
          filter.indicator === "status"
            ? { ...filter, values: [value] }
            : filter
        ),
      },
    }));
  };

  const handlePolicy = (value: any) => {
    setpayloadForAlert((prevData: any) => ({
      ...prevData,
      filters: {
        ...prevData.filters,
        pre_filters: prevData.filters["pre_filters"].map((filter: any) =>
          filter.indicator === "policy"
            ? { ...filter, values: [value] }
            : filter
        ),
      },
    }));
  };

  const handleSearch = () => {
    // console.log("in handlesearch");
    const modifiedData = replaceUnderscoresWithDots(payloadForAlert);
    // console.log("modified payload for alert", modifiedData);

    emit("ws.alert.historical", modifiedData);
  };

  const stableSort = (array: any, comparator: any) => {
    const stabilizedThis = array.map((el: any, index: any) => [el, index]);
    stabilizedThis.sort((a: any, b: any) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el: any) => el[0]);
  };

  const getComparator = (order: any, orderBy: any) => {
    return order === "desc"
      ? (a: any, b: any) => descendingComparator(a, b, orderBy)
      : (a: any, b: any) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (
    a: { [x: string]: number },
    b: { [x: string]: number },
    orderBy: string | number
  ) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (columnField: any) => {
    // console.log("clicked");
    handleColumnToggle(columnField);
    // handleMenuClose();
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
  const handleCSVDrawerOpen = () => {
    setICSVDrawerOpen(true);
  };
  const handleCSVDrawerClose = () => {
    setICSVDrawerOpen(false);
  };

  const isMenuOpen = Boolean(anchorEl);

  const processColumnData = (column: any, row: any) => {
    // Perform operations based on the column and row data
    // console.log("-------column", column);
    // console.log("-------row", row);
    if (column.field === "policy") {
      const policyName: any = allPolicies.find(
        (alert: any) => alert._id === parseInt(row.policy)
      );
      if (policyName && policyName.name) return <div>{policyName.name}</div>;
      // console.log("policname",policyName.name)
    } else if (column.field === "device") {
      const deviceName: any = allDevices.find(
        (alert: any) => alert._id === parseInt(row.device)
      );
      if (deviceName && deviceName.hostname)
        return <div>{deviceName.hostname}</div>;
      // console.log("policname",policyName.name)
    } else if (column.field === "timestamp" || column.field == "__time") {
      const timestamp1 = row.timestamp && row.timestamp;
      const timestamp2 = row.__time && row["__time"];
      // console.log(row["__time"])
      if (timestamp1 && row.timestamp) {
        const formattedDateMonthYear = convertEpochToDateMonthYear(timestamp1);
        return formattedDateMonthYear ? (
          <div className="w-full align-center">{formattedDateMonthYear}</div>
        ) : (
          "-"
        );
      } else if (timestamp2 && row.__time) {
        const formattedDateMonthYear =
          convertEpochToDateMonthYearTwo(timestamp2);
        return formattedDateMonthYear ? (
          <div className="w-full align-center">{formattedDateMonthYear}</div>
        ) : (
          "-"
        );
      }
    }

    // If no specific processing needed, return the original value
    return <div className="px-2">{row[column.field]}</div>;
  };
  const deleteDevice = async () => {
    // console.log("delete array", selectedRows);
    try {
      let response = await bulkActionDeviceDelete(selectedRows);

      if (response.status == "success") {
        handleModalClose();

        toggleDeviceTableState();

        toast.success(response.message, {
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
      // setIsPopupOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE2(event.currentTarget);
  };
  const handleAddMenuClose = () => {
    setAnchorE2(null);
  };

  const handleActionClick = (event: any) => {
    setAnchorE3(event.currentTarget);
  };

  const handleActionClose = () => {
    setAnchorE3(null);
  };

  const runDeviceDiscovery = async (row: any) => {
    try {
      const bodyData = [row._id];
      let response = await runDiscovery(bodyData);
      // console.log(response);
      if (response.status == "success") {
        toggleDeviceTableState();
        toast.success(response.status, {
          position: "bottom-right",
          autoClose: 1000,
        });
      } else {
        toast.error(response.message, {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  // console.log("======", data);

  const severityValues = [
    { label: "WARNING", value: "warning" },
    { label: "MAJOR", value: "major" },
    { label: "CRITICAL", value: "critical" },
  ];
  const statusValues = [
    { label: "ACTIVE", value: "active" },
    { label: "CLEAR", value: "clear" },
  ];

  const handleDate = (event: any) => {
    let updatedPayload: any = { ...payloadForAlert };

    if (event.label !== "custom") {
      delete updatedPayload.start_timestamp;
      delete updatedPayload.end_timestamp;
      updatedPayload = {
        ...updatedPayload,
        time_range: event.text,
      };
    } else {
      const startdate = new Date(event.value[0]);
      const startepochTime = startdate.getTime() / 1000;
      const enddate = new Date(event.value[1]);
      const endepochTime = enddate.getTime() / 1000;
      updatedPayload = {
        ...updatedPayload,
        time_range: event.text,
        start_timestamp: startepochTime,
        end_timestamp: endepochTime,
      };
    }
    setpayloadForAlert(updatedPayload);
  };
  const handleSelectedButtons = (value: any) => {
    let newValues = Array.isArray(value) ? value : [value];
    newValues.forEach((newValue: any) => {
      setSelectedButtons((prevState: any) => {
        // Check if newValue already exists in prevState
        if (prevState.includes(newValue)) {
          return prevState; // If it exists, return the current state
        } else {
          return [...prevState, newValue]; // If not, add newValue to the state
        }
      });
    });
  };

  // console.log("------------selected buttons", selectedButtons);
  return (
    <>
      <div>
        <div className="flex justify-between">
          <div className=" justify-between dark:text-white">
            {/* Global Search for table */}
            <div className="flex">
              <div className="border items-center rounded-lg h-[2.3rem] dark:border-dark-border border-textColor flex justify-end w-fit m-2 mt-3 dark:text-white">
                <IconButton>
                  <SearchIcon
                    className="dark:text-dark-border text-textColor "
                    fontSize="small"
                  />
                </IconButton>
                <InputBase
                  className="dark:text-textColor"
                  placeholder="Search"
                  value={search}
                  onChange={handleSearchChange}
                />
                {/* {search != "" && ( */}
                <ClearIcon
                  onClick={() => {
                    setSearch("");
                  }}
                  className="cursor-pointer rounded-2xl"
                  fontSize="small"
                  color={search == "" ? "disabled" : "warning"}
                  sx={{ fontSize: "13px", marginRight: "8px" }}
                />
                {/* )} */}
              </div>
              {activeButton == "live" && (
                <div className="flex mr-2 mb-2 mt-3 items-center">
                  <div>
                    <div className="text-white w-[8rem] rounded-lg mx-2 bg-yellow-400 dark:bg-yellow-500 py-[0.5rem] px-2">
                      Warning : 20
                    </div>
                  </div>
                  <div>
                    <div className="text-white w-[8rem] rounded-lg mx-2 bg-orange-400 dark:bg-orange-600 py-[0.5rem] px-2">
                      Major : 10
                    </div>
                  </div>
                  <div>
                    <div className="text-white w-[8rem] rounded-lg mx-2 bg-red-500 dark:bg-red-700 py-[0.5rem] px-2">
                      Critical : 30
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex">
            {/* <div className="flex items-center m-4 mr-0">
              {selected ? (
                <>
                  <Tooltip
                    TransitionComponent={Zoom}
                    title="Delete selected Assets"
                    placement="top"
                  >
                    <DeleteForeverIcon
                      onClick={handleModalOpen}
                      className="cursor-pointer dark:text-textColor"
                      style={{
                        margin: "0 5px",
                      }}
                    />
                  </Tooltip>
                  <DeleteModal
                    open={isModalopen}
                    handleModalClose={handleModalClose}
                    deleteRow={deleteDevice}
                  />
                  <Tooltip
                    TransitionComponent={Zoom}
                    title="Download selected Assets"
                    placement="top"
                  >
                    <FileDownloadIcon
                      onClick={downloadCSV}
                      className="cursor-pointer dark:text-textColor"
                      style={{
                        margin: "0 5px",
                      }}
                    />
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip
                    TransitionComponent={Zoom}
                    title="Delete selected Assets (Disabled)"
                    placement="top"
                  >
                    <DeleteForeverIcon
                      color="disabled"
                      className="cursor-pointer dark:text-gray-700"
                      style={{
                        margin: "0 5px",
                      }}
                    />
                  </Tooltip>
                  <Tooltip
                    TransitionComponent={Zoom}
                    title="Download selected Assets (Disabled)"
                    placement="top"
                  >
                    <FileDownloadIcon
                      className="cursor-pointer dark:text-gray-700"
                      color="disabled"
                      style={{
                        margin: "0 5px",
                      }}
                    />
                  </Tooltip>
                </>
              )}
              <Tooltip
                TransitionComponent={Zoom}
                title="Hide/UnHide Columns"
                placement="top"
              >
                <ViewColumnIcon
                  className="text-dark-border dark:text-light-menu-color"
                  style={{ margin: "0 10px 0 5px" }}
                  onClick={handleMenuOpen}
                />
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                style={{ padding: "0" }}
              >
                {columns &&
                  columns.map((column: any) => (
                    <MenuItem
                      className="bg-light-container dark:bg-dark-container dark:text-textColor hover:dark:bg-tabel-header"
                      style={{
                        fontFamily: `"Poppins", sans-serif`,
                      }}
                      key={column.field}
                      onClick={() => handleMenuItemClick(column.field)}
                    >
                      <Checkbox
                        className=" dark:text-textColor"
                        style={{
                          padding: "0 .5rem",
                        }}
                        size="small"
                        checked={visibleColumns.includes(column.field)}
                        // onChange={() => handleMenuItemClick(column.field)}
                      />
                      {column.headerName
                        .split(" ")
                        .map((word: any) =>
                          word
                            .split("_")
                            .map(
                              (subWord: any) =>
                                subWord.charAt(0).toUpperCase() +
                                subWord.slice(1)
                            )
                            .join(" ")
                        )
                        .join(" ")}
                    </MenuItem>
                  ))}
              </Menu>
            </div> */}

            {/* Add Device Menu and Model */}

            <div className=" flex m-2 mt-3 items-center h-fit">
              <div className="flex items-center">
                <ButtonGroup variant="outlined" aria-label="Basic button group">
                  <Button
                    className={`dark:text-textColor border-primary2 !px-[2.75rem] !py-[0.3rem] rounded-lg   ${
                      activeButton == "live" &&
                      "bg-primary2 hover:bg-primary2 text-white discButtonGroup"
                    }`}
                    onClick={() => {
                      handleToggleButtonClick("live");
                    }}
                  >
                    Live
                  </Button>
                  <Button
                    className={`dark:text-textColor border-primary2 !px-[2.75rem] !py-[0.3rem] rounded-lg   ${
                      activeButton == "historic" &&
                      "bg-primary2 hover:bg-primary2 text-white discButtonGroup"
                    }`}
                    onClick={() => {
                      handleToggleButtonClick("historic");
                    }}
                  >
                    Historic
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
          {/* Global Downlad and delete button for table */}
        </div>
        <div>
          {activeButton == "historic" && (
            <div className="flex mr-2 mb-3 mt-1 items-center">
              <div>
                <SmallSingleSelect
                  label="Severity"
                  isMulti={true}
                  selectData={severityValues}
                  onChange={handleSeverity}
                />
              </div>
              <div>
                <SmallSingleSelect
                  label="Device"
                  isMulti={true}
                  selectData={deviceValues}
                  onChange={handleDevice}
                />
              </div>
              <div>
                <SmallSingleSelect
                  label="Policy"
                  isMulti={true}
                  selectData={policyValues}
                  onChange={handlePolicy}
                />
              </div>
              <div>
                <SmallSingleSelect
                  label="Status"
                  isMulti={true}
                  selectData={statusValues}
                  onChange={handleStatus}
                />
              </div>
              <div className="w-[15rem] ml-2">
                {/* <DateRangePicker
                  placement="auto"
                  value={timePeriod}
                  //   onChange={setTimePeriod}
                  onChange={(e: any) => handleDate(e)}
                  ranges={predefinedRanges}
                  // showOneCalendar
                  style={{ width: "100%" }}
                  shouldDisableDate={afterToday()}
                  placeholder="Select Date Range"
                  format="yyyy-MM-dd"
                  className="hover:bg-gray-50 focus:bg-gray-50 dark:bg-card-color"
                /> */}
                <TimeRangePicker onTimeRangeChange={handleDate} />

                {/* </CustomProvider> */}
              </div>
              <div className="ml-3" onClick={handleSearch}>
                <div className=" mx-2 inline-flex items-center justify-center rounded-md py-2 px-6 text-center font-medium text-white bg-primary2 hover:bg-opacity-90 lg:px-6 xl:px-6 cursor-pointer">
                  Search
                </div>
                {/* <CustomeButton title="Search" /> */}
              </div>
              {/* <Tooltip
                  TransitionComponent={Zoom}
                  title="Reset Filter"
                  placement="top"
                >
                  <RestartAltIcon
                    onClick={handleResetButtonClick}
                    className="cursor-pointer mx-2"
                  />
                </Tooltip> */}
            </div>
          )}
          {activeButton == "live" && (
            <div className="flex mr-2 mb-3 mt-1 items-center">
              <div>
                <SmallSingleSelect
                  label="Severity"
                  isMulti={true}
                  selectData={severityValues}
                  onChange={handleSelectedButtons}
                />
              </div>
              <div>
                <SmallSingleSelect
                  label="Device"
                  isMulti={true}
                  selectData={deviceValues}
                  onChange={handleSelectedButtons}
                />
              </div>
              <div>
                <SmallSingleSelect
                  label="Policy"
                  isMulti={true}
                  selectData={policyValues}
                  onChange={handleSelectedButtons}
                />
              </div>
              <div>
                <SmallSingleSelect
                  label="Status"
                  isMulti={true}
                  selectData={statusValues}
                  onChange={handleSelectedButtons}
                />
              </div>
              {/* <Tooltip
                  TransitionComponent={Zoom}
                  title="Reset Filter"
                  placement="top"
                >
                  <RestartAltIcon
                    onClick={handleResetButtonClick}
                    className="cursor-pointer mx-2"
                  />
                </Tooltip> */}
            </div>
          )}
        </div>
      </div>
      {data && data.length != 0 ? (
        <div
          className=""
          style={{
            width: "100%",
            overflow: "auto",
            borderRadius: "0",
            marginTop: ".5rem",
          }}
        >
          <div className="max-h-440 ">
            <table className="w-full border-collapse overflow-auto">
              <thead>
                <tr>
                  <th
                    className="bg-textColor  dark:bg-tabel-header dark:text-textColor"
                    style={{
                      padding: "8px",
                      fontSize: "11px",
                      textAlign: "center",
                      borderBottom: "0",
                      fontWeight: "bolder",
                      // backgroundColor:"#D8D8D8"
                    }}
                  >
                    <Checkbox
                      className=" dark:text-textColor"
                      size="small"
                      style={{ padding: "0" }}
                      checked={selectAll}
                      onChange={handleSelectAllCheckboxToggle}
                    />
                  </th>
                  {columns &&
                    columns
                      .filter((column: any) =>
                        visibleColumns.includes(column.field)
                      )
                      .map((column: any, colIndex: any) => {
                        const iconDirection = column.field ? order : "asc";
                        return (
                          <th
                            className="bg-textColor text-start text-tabel-header dark:text-textColor dark:bg-tabel-header"
                            key={column.id}
                            // align={column.align}
                            style={{
                              padding: "0px 8px",
                              minWidth: column.minWidth,
                              fontSize: "14px",
                              fontWeight: "600",
                              borderBottom: "0",
                              letterSpacing: ".7px",
                              fontStyle: "normal",
                              fontFamily: `"Poppins", sans-serif`,
                              // backgroundColor:"#D8D8D8"
                            }}
                          >
                            <TableSortLabel
                              className={`flex  ${
                                colIndex == 0 || colIndex == 1
                                  ? "justify-start  "
                                  : "justify-start"
                              }`}
                              //   style={{
                              //     display: "flex",
                              //     justifyContent: "center",
                              //     paddingLeft: "2rem",
                              //   }}
                              active={orderBy === column.field}
                              direction={
                                iconDirection as "asc" | "desc" | undefined
                              }
                              onClick={() => handleRequestSort(column.field)}
                              style={{
                                color: "inherit",
                                textDecoration: "none",
                              }}
                            >
                              {column.headerName
                                .split(" ")
                                .map((word: any) =>
                                  word
                                    .split("_")
                                    .map(
                                      (subWord: any) =>
                                        subWord.charAt(0).toUpperCase() +
                                        subWord.slice(1)
                                    )
                                    .join(" ")
                                )
                                .join(" ")}
                            </TableSortLabel>
                          </th>
                        );
                      })}
                </tr>
              </thead>
              <tbody>
                {stableSort(filteredData, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: any, rowIndex: any) => {
                    const isLastRow = rowIndex === data.length - 1;
                    // console.log("-------ROW--------", row);
                    return (
                      <tr
                        className="bg-white dark:bg-dark-container dark:text-textColor"
                        role="checkbox"
                        tabIndex={-1}
                        key={row._id}
                      >
                        <td
                          style={{
                            //   padding: "8px",
                            textAlign: "center",
                          }}
                          className={`bg-white dark:bg-dark-container dark:text-textColor dark:border-dark-border ${
                            isLastRow ? "border-b" : "border-b"
                          }`}
                        >
                          <Checkbox
                            className=" dark:text-textColor"
                            style={{
                              padding: "0",
                              textAlign: "center",
                            }}
                            color="primary"
                            size="small"
                            checked={selectedRows.includes(row._id)}
                            onChange={() => handleRowCheckboxToggle(row._id)}
                          />
                        </td>
                        {columns &&
                          columns
                            .filter((column: any) =>
                              visibleColumns.includes(column.field)
                            )
                            .map((column: any, colIndex: any) => {
                              const value = row[column.field];
                              const processedValue = processColumnData(
                                column,
                                row
                              );

                              return (
                                <td
                                  className={`dark:bg-dark-container dark:text-textColor dark:border-dark-border ${
                                    isLastRow ? "border-b " : "border-b "
                                  }`}
                                  key={column.id}
                                  align={column.align}
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: "normal",
                                    padding: "px",
                                    textAlign: "center",
                                    fontFamily: `"Poppins", sans-serif`,
                                  }}
                                >
                                  <span
                                    className={`flex ${
                                      colIndex == 0 || colIndex == 1
                                        ? "justify-start"
                                        : "justify-start "
                                    }`}
                                  >
                                    {column.format &&
                                    typeof processedValue === "number"
                                      ? column.format(processedValue)
                                      : processedValue}
                                  </span>
                                </td>
                              );
                            })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center p-5">
          <p className="dark:text-textColor">No Data</p>
        </div>
      )}
    </>
  );
};

export default AlertTable;
