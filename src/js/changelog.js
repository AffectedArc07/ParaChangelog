import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col, Button, PageHeader, DatePicker, Card, Space } from 'antd';
import { API } from './apimanager';
import moment from "moment";
import Link from 'antd/lib/typography/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderMinus, faFolderPlus, faHelmetSafety, faMinus, faPlus, faScrewdriverWrench, faSliders, faSpellCheck, faTriangleExclamation, faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';

export const ChangelogList = () => {
  const [changelogList, setChangelogList] = useState([]);
  const [currentlyLoading, setCurrentlyLoading] = useState(false);

  const updateClDate = async day => {
    if (day === null) {
      return;
    }
    const formatted_day = moment(day).format("YYYY-MM-DD");
    API.clearEntries();
    setCurrentlyLoading(true);
    await API.loadEntriesByDate(formatted_day);
    setChangelogList(API.getEntries());
    setCurrentlyLoading(false);
  };

  const initCL = async () => {
    await API.loadEntriesByDate(moment().format("YYYY-MM-DD"));
    setChangelogList(API.getEntries());
  };

  const loadMoreCL = async () => {
    await API.loadEntriesByDate(null);
    setChangelogList(API.getEntries());
  };

  // Get our CLs list
  useEffect(() => {
    if (changelogList.length === 0) {
      initCL();
    }
  }, []);

  const pageheader = (
    <PageHeader
      title="Changelog Entries"
      extra={
        <Fragment key={"1"}>
          <h1>Start Date</h1>
          <DatePicker defaultValue={moment()} onChange={updateClDate} format={"YYYY-MM-DD"} allowClear={false} />
        </Fragment>
      }
    />
  );

  if (changelogList.length === 0) {
    return (
      <>
        {pageheader}
        <Row>
          <Col span={3} />
          <Col span={16} style={{ "textAlign": "center" }}>
            <img src={require("../img/loadingcat.gif")} width="100px" />
            <h1><big>Loading...</big></h1>
          </Col>
          <Col span={3} />
        </Row>
      </>
    );
  }

  const loadMore = async () => {
    setCurrentlyLoading(true);
    await loadMoreCL();
    setCurrentlyLoading(false);
  };

  const iconMap = {
    'FIX': <FontAwesomeIcon icon={faScrewdriverWrench} title="Fix" />,
    'WIP': <FontAwesomeIcon icon={faHelmetSafety} title="WIP" color="orange" />,
    'TWEAK': <FontAwesomeIcon icon={faSliders} title="Tweak" />,
    'SOUNDADD': <FontAwesomeIcon icon={faVolumeHigh} title="Sound Added" color="green" />,
    'SOUNDDEL': <FontAwesomeIcon icon={faVolumeXmark} title="Sound Removed" color="red" />,
    'CODEADD': <FontAwesomeIcon icon={faPlus} title="Code Addition" color="green" />,
    'CODEDEL': <FontAwesomeIcon icon={faMinus} title="Code Removal" color="red" />,
    'IMAGEADD': <FontAwesomeIcon icon={faFolderPlus} title="Sprite Addition" color="green" />,
    'IMAGEDEL': <FontAwesomeIcon icon={faFolderMinus} title="Sprite Removal" color="red" />,
    'SPELLCHECK': <FontAwesomeIcon icon={faSpellCheck} title="Spelling/Grammar Fix" />,
    'EXPERIMENT': <FontAwesomeIcon icon={faTriangleExclamation} title="Experimental" color="orange" />,
  };

  return (
    <>
      {pageheader}
      <Space direction="vertical" style={{ display: 'flex' }}>
        {API.getEntries().map(e => {
          return (
            <Card
              title={
                <>
                  <Button type="primary" ghost href={`https://github.com/ParadiseSS13/Paradise/pull/${e.pr_number}`} target={"_blank"}>
                    #{e.pr_number}
                  </Button>
                  <span style={{ "marginLeft": "8px" }}>by {e.author} - Merge time: {e.dm}</span>
                </>
              }
              key={e.pr_number}>
              <ul style={{ "listStyleType": "none" }}>
                {e.cl_entries.map(e => {
                  return (
                    <li key={e.id}>{iconMap[e.clt]} {e.cle}</li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </Space>
      <Row>
        <Col span={24} style={{ "textAlign": "center" }}>
          <Button size="large" ghost type="primary" disabled={currentlyLoading} onClick={() => loadMore()} style={{ marginTop: "20px" }}>
            {currentlyLoading ? "Loading..." : "Load More"}
          </Button>
        </Col>
      </Row>
    </>
  );
};
