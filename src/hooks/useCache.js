import { useState, useEffect } from "react";
import { arrayWithId } from "../utils";

const storage = {
  getData: (key) => JSON.parse(localStorage.getItem(key)),
  setData: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
};

// This hook involves using cached assets if they are found in the cache,
// and then revalidating the cache and updating it with a newer version of
// the asset if needed.
// If you pass onlyCache as True then it will load real data only once
// and continue using cached data
export default function useCache(asyncFn, key, onlyCache = false) {
  let [data, setData] = useState([]);

  useEffect(() => {
    const cacheKey = key;

    const fetchData = () =>
      asyncFn().then((newData) => {
        let d = {};
        if (newData.docs) {
          d = arrayWithId(newData);
        } else if (newData.data) {
          d = newData.data();
        } else {
          d = newData;
        }
        storage.setData(cacheKey, d);
        setData(d);
      });

    // try to get cached data
    const cacheData = storage.getData(cacheKey);

    // load new data once and then use cache
    if (onlyCache === true) {
      if (cacheData) setData(cacheData);
      else fetchData();
    }

    // fetch new data
    if (onlyCache === false) {
      if (cacheData) setData(cacheData);
      fetchData();
    }
  }, []);

  return data;
}
