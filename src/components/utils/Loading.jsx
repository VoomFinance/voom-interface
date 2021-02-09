import React from "react";
import { useSelector } from "react-redux";

const Loading = () => {
    const isLoading = useSelector((store) => store.loading.isLoading);

    return (
        <>
          {
              isLoading === true &&
              <div className="loading">Loading&#8230;</div>
          }  
        </>
    )
}

export default Loading
