import { baseURL } from "@/constants";

export const getSNMPCatalog = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(baseURL + "/api/v1/settings/snmp-catalog", {
    method: "GET",
    // body: JSON.stringify(props),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  //   console.log("data", data);
  return data;
};

export const getSNMPCatalogById = async (props: any) => {
  const token = localStorage.getItem("token");
  const res = await fetch(baseURL + `/api/v1/settings/snmp-catalog/${props}`, {
    method: "GET",
    // body: JSON.stringify(props),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  //   console.log("data", data);
  return data;
};

export const addSNMPCatalog = async (props: any) => {
  const token = localStorage.getItem("token");
  const res = await fetch(baseURL + "/api/v1/settings/snmp-catalog", {
    method: "POST",
    body: JSON.stringify(props),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  //   console.log("data", data);
  return data;
};

export const deleteSNMPCatalog = async (props: any) => {
  const token = localStorage.getItem("token");
  const res = await fetch(baseURL + `/api/v1/settings/snmp-catalog/${props}`, {
    method: "Delete",
    // body: JSON.stringify(props),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  //   console.log("data", data);
  return data;
};

export const deleteBulkSNMPCatalog = async (props: any) => {
  const token = localStorage.getItem("token");
  const res = await fetch(baseURL + `/api/v1/settings/snmp-catalog`, {
    method: "Delete",
    body: JSON.stringify(props),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  //   console.log("data", data);
  return data;
};

export const updateSNMPCatalog = async (modifiedData: any, id: any) => {
  const token = localStorage.getItem("token");
  const res = await fetch(baseURL + `/api/v1/settings/snmp-catalog/${id}`, {
    method: "PUT",
    body: JSON.stringify(modifiedData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  //   console.log("data", data);
  return data;
};
