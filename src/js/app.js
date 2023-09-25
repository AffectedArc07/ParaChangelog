import React, { Fragment } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Row, Col, Layout, PageHeader, DatePicker } from 'antd';
import { ChangelogList } from './changelog';
const { Content } = Layout;

export const App = () => {
  return (
    <HashRouter>
      <Layout
        style={{ height: '100%' }}>
        <PageHeader
          className="site-page-header"
          title={
            <>
              {"Paradise Changelog - "}
              <a href="https://github.com/AffectedArc07/ParaChangelog">
                Source
              </a>
            </>
          }
        />
        <Layout>
          <Content style={{ padding: '16px' }}>
            <Row>
              <Col span={3} />
              <Col span={18}>
                <Routes>
                  <Route path="/" element={<ChangelogList />} />
                </Routes>
              </Col>
              <Col span={3} />
            </Row>
          </Content>
        </Layout>
      </Layout>
    </HashRouter>
  );
};
