import React, { useState, useEffect } from "react";
import {
  replaceDotsWithUnderscores,
  replacePeriodsWithUnderscores,
} from "@/functions/genericFunctions";
import CustomPagination from "@/pages/Components/CustomePagination";
import { getAllDevice } from "../api/api/DeviceManagementAPI";
import AllDeviceTabel from "../Components/Tabels/AllDeviceTabel";
import { ToastContainer } from "react-toastify";
import { useAppContext } from "../Components/AppContext";
import "react-toastify/dist/ReactToastify.css";
import AlertTable from "../Components/Tabels/AlertTable";
import { useWebSocketContext } from "../Components/WebSocketContext";
import AuditTable from "../Components/Tabels/AuditTable";

const Audit = () => {
  const {
    deviceTabelState,
    activeButton,
    toggleActiveButton,
    auditSocketCalled,
  } = useAppContext();
  const { Subscribe, emit, connection ,unsubscribe } = useWebSocketContext();

  const [data, setData] = useState<any>();
  const [webSocketCalled, setWebSocketCalled] = useState<any>();
  const [columns, setColumns] = useState<any>();
  const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [visibleColumns, setVisibleColumns] = useState<any>([]);
  const [collectedKeys, setCollectedKeys] = useState<any>([]);
  // const [receivedDataLive, setReceivedDataLive] = React.useState<any>();
  const [receivedData, setReceivedData] = React.useState<any>();

  const [currentPage, setCurrentPage] = useState(1) as any;
  const [rowsPerPage, setRowsPerPage] = useState(10) as any;

  const handlePageChange = (newPage: any) => {
    setPage(newPage - 1);
    setCurrentPage(newPage);
    setPage(newPage - 1);
    // Fetch data for the new page if needed
  };
  // console.log("current page", currentPage);
  const handleRowsPerPageChange = (newRowsPerPage: any) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to the first page when changing rows per page
    setPage(0);
    // Fetch data for the new rowsPerPage if needed
  };
  const paylodForLive = {};

  // console.log("activbutton", activeButton);
  
  useEffect(() => {
    function render(payload: any) {
      // Check if payload contains 'result' array
      console.log("response for audit", payload);
      if (payload && payload.result && Array.isArray(payload.result)) {
        // Iterate over each result object
        const filteredResult = payload.result.map((result: any) => {
          // Create a copy of the result object
          const resultCopy = { ...result };
          // Check if the result object has 'rowSignature' key and remove it
          if (resultCopy.rowSignature) {
            delete resultCopy.rowSignature;
          }
          return resultCopy;
        });
  
        // Create a new object with filtered result and other properties from payload
        const filteredPayload = { ...payload, result: filteredResult };
        console.log("filterdata state#########", filteredPayload);
  
        // Store filtered payload in state
        setReceivedData(filteredPayload);
      }
    }
    if (connection && auditSocketCalled) {
      Subscribe("audit1", "ws.audit", render);
    }
    // return () => {
    //   // Clean up subscription when component unmounts
    //   unsubscribe("audit1", "ws.audit");
    
    // };
  }, [connection , auditSocketCalled ]);


  useEffect(()=>{
   
    return () => {
      // Clean up subscription when component unmounts
      unsubscribe("audit1", "ws.audit");
    
    };
  },[connection])
  console.log("recieved data", receivedData);
  //   useEffect(() => {
  //  if (activeButton == "historic") {
  //       setData(null);
  //       setColumns(null);
  //       setVisibleColumns(null);
  //       // setReceivedData({
  //       //   result: [
  //       //     {
  //       //       segmentId:
  //       //         "alert_2024-03-20T00:00:00.000Z_2024-03-21T00:00:00.000Z_2024-03-20T05:48:09.765Z_1",
  //       //       columns: [
  //       //         "__time",
  //       //         "_id",
  //       //         "policy",
  //       //         "device",
  //       //         "object",
  //       //         "indicator",
  //       //         "severity",
  //       //         "status",
  //       //         "triggered.value",
  //       //         "message",
  //       //         "previous.status",
  //       //         "event.type",
  //       //         "cleared.by",
  //       //       ],
  //       //       events: [
  //       //         [
  //       //           1710914888000,
  //       //           "78202321932342",
  //       //           "1231575388837024",
  //       //           "641660281176464",
  //       //           "3",
  //       //           "interface.in.packets",
  //       //           "critical",
  //       //           "clear",
  //       //           "3086822",
  //       //           "critical! 90924498573889's 3 [interface.in.packets] has 3 occurrences in 600 seconds",
  //       //           "clear",
  //       //           "notify.alert.state.change",
  //       //           "system",
  //       //         ],
  //       //       ],
  //       //       // rowSignature: [
  //       //       //   {
  //       //       //     name: "__time",
  //       //       //     type: "LONG",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "_id",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "policy",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "device",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "object",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "indicator",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "severity",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "status",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "triggered.value",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "message",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "previous.status",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "event.type",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "cleared.by",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       // ],
  //       //     },
  //       //     {
  //       //       segmentId:
  //       //         "alert_2024-03-20T00:00:00.000Z_2024-03-21T00:00:00.000Z_2024-03-20T05:48:09.765Z_1",
  //       //       columns: [
  //       //         "__time",
  //       //         "_id",
  //       //         "policy",
  //       //         "device",
  //       //         "object",
  //       //         "indicator",
  //       //         "severity",
  //       //         "status",
  //       //         "triggered.value",
  //       //         "message",
  //       //         "previous.status",
  //       //         "event.type",
  //       //         "cleared.by",
  //       //       ],
  //       //       events: [
  //       //         [
  //       //           1710914888000,
  //       //           "78202321932343",
  //       //           "1231575388837024",
  //       //           "641660281176464",
  //       //           "3",
  //       //           "interface.in.packets",
  //       //           "critical",
  //       //           "clear",
  //       //           "3086822",
  //       //           "critical! 90924498573889's 3 [interface.in.packets] has 3 occurrences in 600 seconds",
  //       //           "clear",
  //       //           "notify.alert.state.change",
  //       //           "system",
  //       //         ],
  //       //       ],
  //       //       // rowSignature: [
  //       //       //   {
  //       //       //     name: "__time",
  //       //       //     type: "LONG",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "_id",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "policy",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "device",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "object",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "indicator",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "severity",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "status",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "triggered.value",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "message",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "previous.status",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "event.type",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       //   {
  //       //       //     name: "cleared.by",
  //       //       //     type: "STRING",
  //       //       //   },
  //       //       // ],
  //       //     },
  //       //   ],
  //       // });
  //     }
  //   }, [activeButton]);

  function convertKeys(obj: any) {
    const newObj: any = {};
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newKey: any = key.replace(/\./g, "_");
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          newObj[newKey] = convertKeys(obj[key]);
        } else {
          newObj[newKey] = obj[key];
        }
      }
    }
    return newObj;
  }
  function collectUniqueKeys(data: any) {
    const uniqueKeys = new Set();

    // Iterate over each object in the result
    for (const objKey in data.result) {
      const nestedObj = data.result[objKey];
      for (const key in nestedObj) {
        if (!key.startsWith("_")) {
          uniqueKeys.add(key);
        }
      }
    }

    return Array.from(uniqueKeys);
  }
  interface EventData {
    [key: string]: string | number;
  }

  interface Segment {
    columns: string[];
    events: string[][];
  }

  interface Result {
    result: Segment[];
  }
  function convertAlertData(jsonData: Result) {
    if (jsonData && jsonData.result && Array.isArray(jsonData.result)) {
      return jsonData.result.flatMap(
        (segment) =>
          segment.events &&
          segment.events.map((event) => {
            const convertedEvent: EventData = {};
            for (let i = 0; i < segment.columns.length; i++) {
              const columnName = segment.columns[i].replace(/\./g, "_"); // Replace "." with "_"
              convertedEvent[columnName] = event[i];
            }
            return convertedEvent;
          })
      );
    }
  }

  useEffect(() => {
    let col = [] as any;
    const hiddenColumnsValues = [
      // "alias",
      "discovery_schedulers",

      // "last_discovered_on",
    ];
    let cols: any = [];

    let collectedKeys =
      receivedData &&
      receivedData.result &&
      receivedData.result[0] &&
      receivedData.result[0].columns;
    
    const convertedData = convertAlertData(receivedData);
     console.log("-----------converted data", convertedData);
    setData(convertedData);
    collectedKeys &&
      collectedKeys.filter((key: any) => {
        if (key == "__time") {
          cols.push({
            field: "__time",
            headerName: "Timestamp",
            minWidth: 160,
          });
        } else if (key == "collection") {
          cols.push({
            field: "collection",
            headerName: "Collection",
            minWidth: 160,
          });
        } else if (key == "status") {
          cols.push({
            field: "status",
            headerName: "status",
            minWidth: 60,
          });
        } else if (key == "remote.host") {
          cols.push({
            field: "remote.host",
            headerName: "Remote Host",
            minWidth: 160,
          });
        } else if (key == "username") {
          cols.push({
            field: "username",
            headerName: "User",
            minWidth: 160,
          });
        } else if (key == "message") {
          cols.push({
            field: "message",
            headerName: "Message",
            minWidth: 200,
          });
        } else
          cols.push({
            field: key.replace(/\./g, "_"),
            headerName: key.replace(/\./g, " "),
            minWidth: 60,
          });
        // }
        // }
      });
    setColumns(cols);
    cols &&
      setVisibleColumns(
        cols
          .map((column: any) => column.field)
          .filter((field: any) => !hiddenColumnsValues.includes(field))
      );
    // console.log("-----------data#########", data);

    // setColumns(cols);
  }, [receivedData , auditSocketCalled]);

  const totalCount = data && data.length;
  const handleChangePage = (
    event: any,
    newPage: React.SetStateAction<number>
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // console.log("##########columns", columns);
  // console.log("##########visibilecolumns", visibleColumns);
  // console.log("##########data", data);
  return (
    <>
      <ToastContainer />
      <div className="w-full ">
        {/* <PageHeading heading="Credential Profile" /> */}
        <AuditTable
          data={data}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          columns={columns}
          page={page}
          rowsPerPage={rowsPerPage}
        />
        <div
          style={{
            position: "fixed",
            bottom: 0,
            backgroundColor: "#fff", // Set your desired background color
            zIndex: 0, // Adjust the z-index as needed
          }}
        >
          <CustomPagination
            totalCount={totalCount}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
          {/* <TablePagination
            className="bg-light-container dark:bg-dark-container dark:text-textColor pt-12"
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={data && data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </div>
      </div>
    </>
  );
};

export default Audit;
