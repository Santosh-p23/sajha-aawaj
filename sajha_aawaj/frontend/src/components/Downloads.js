import React, { Component, useEffect, useState } from "react";
import axios from "axios";

const Downloads = () => {
  useEffect(() => {
    axios
      .get(`/api/snippet_verified`)
      .then((res) => {
        console.log('download start');
      })
      .catch((err) => console.log("error", err));
  }, []);

  return <div>
    <a href="/api/snippet_verified"> First Release</a> </div>;
};

export default Downloads;
