import React from "react";
import { formatDistanceToNow } from "date-fns";

function TimeAgo({ timestamp }) {
  const formattedTimeAgo = formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
  });

  return <span>{formattedTimeAgo}</span>;
}

export default TimeAgo;
