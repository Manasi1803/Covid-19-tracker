import React from 'react';
import "./InfoBox.css";
import { Card, CardContent, Typography } from '@material-ui/core';

function InfoBox({title, cases, isRed, total, active, ...props}) {
  return (
    // --selected used for modifying of the element __ is used for elements change
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`}>
      <CardContent>
      {/*Title i.e coronavirus cases */}
        <Typography className="infoBox__title" color="textSecondary" >
          {title}
        </Typography>
      {/*+120K No of cases */}
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>
      {/*1.2M Total*/}
        <Typography className="InfoBox__total" color="textSecondary" >
          {total} Total
        </Typography>

      </CardContent>
    </Card>
  )
};

export default InfoBox;
