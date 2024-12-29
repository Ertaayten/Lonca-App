import axios from "axios";
import config from "../config";

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
});

export const getProductSales = async (vendorId) => {
  try {
    const response = await apiClient.get(`/products/sales?vendorId=${vendorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product sales:", error);
    throw error;
  }
};

export const getMonthlySales = async (vendorId) => {
  try {
    const response = await apiClient.get(
      `/products/monthly-sales?vendorId=${vendorId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly sales:", error);
    throw error;
  }
};

