import React, { useState } from "react"
import "./style.scss"
import SearchFilterForm from "./SearchFilterForm"

import { Tabs, Tab } from "react-bootstrap"

const SearchFilter = props => {
  const [key, setKey] = useState("oneway")
  return (
    <div className="sfilter-tabs">
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={k => setKey(k)}
      >
        <Tab eventKey="oneway" title="One way">
          <SearchFilterForm onSearch={props.onSearch} activeKey={key} />
        </Tab>
        <Tab eventKey="return" title="Return">
          <SearchFilterForm onSearch={props.onSearch} activeKey={key} />
        </Tab>
      </Tabs>
    </div>
  )
}

export default SearchFilter
