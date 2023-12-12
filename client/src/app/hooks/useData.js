
import { isArray } from 'lodash';
import { useState, useEffect } from 'react';

const useData = (type, company_id, id) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchUrl = id ? `/api/${type}/${company_id}/${id}` : `/api/${type}/${company_id}`;

  useEffect(() => {
    setLoading(true);
    fetch(fetchUrl)
      .then(response => response.json())
      .then(responseData => {
        setData(responseData);
        setTimeout(function(){
          setLoading(false);
        }, 1000);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const saveData = async (requestData) => {
    delete requestData.id;
    requestData.company_id = company_id;
    console.log("data: " + JSON.stringify(requestData));
    setLoading(true);
    try {
      const response = await fetch(`/api/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      const responseData = await response.json();
      if (!responseData.id) {
        setError(responseData);
        setSuccess(null);
        setLoading(false);
        return null;
      } 
      if (isArray(data)) {
        setData([responseData, ...data]);
      } else {
        setData(responseData);
      }
      setSuccess(`${type} saved successfully`);
      setTimeout(function(){
        setSuccess(null);
      }, 5000);
      setTimeout(function(){
        setLoading(false);
      }, 1000);
      return responseData;
    } catch (error) {
      setError(error);
      setSuccess(null);
      setLoading(false);
    }
  };

  const updateData = async (updatedData) => {
    const itemId = updatedData.id;
    updatedData.company_id = company_id;
    console.log("updateData: " + JSON.stringify(updatedData));
    setLoading(true);
    try {
      const response = await fetch(`/api/${type}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });
      const responseData = await response.json();
      if (isArray(data)) {
        setData(data.map(item => item.id == itemId ? responseData : item));
      } else {
        setData(responseData);
      }
      
      setSuccess(`${type} updated successfully`);
      setTimeout(function(){
        setSuccess(null);
      }, 5000);
      setTimeout(function(){
        setLoading(false);
      }, 1000);
      return responseData;
    } catch (error) {
      setError(error);
      setSuccess(null);
      setLoading(false);
    }
  };

  const deleteData = async (dataId) => {
    console.log(`deleteData-${type}: ` + dataId);
    setLoading(true);
    try {
      const response = await fetch(`/api/${type}/${dataId}`, {
        method: 'DELETE',
      });

      const responseData = await response.json();
      if (!responseData.id) {
        setError(responseData);
        setTimeout(function(){
          setError(null);
        }, 5000);
        setSuccess(null);
        setLoading(false);
        return null;
      } else {
        setSuccess(`${type} deleted successfully`);
        setTimeout(function(){
          setSuccess(null);
        }, 5000);
        const returnData = data.filter(item => item.id != responseData.id);
        setData(returnData);
        setTimeout(function(){
          setLoading(false);
        }, 1000);
        return responseData;
      }
    } catch (error) {
      setError(error);
      setTimeout(function(){
        setError(null);
      }, 5000);
      setLoading(false);
      setSuccess(null);
    }
  };

  return { data, loading, error, saveData, updateData, deleteData, success };
};

export default useData;
