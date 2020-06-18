import React from "react"
import "./style.scss"
import Select from "react-select"
import { Row, Col } from "react-bootstrap"
import { DatePicker } from "@y0c/react-datepicker"

import "@y0c/react-datepicker/assets/styles/calendar.scss"

const city = [
  { value: "PNQ", label: "Pune (PNQ)" },
  { value: "BOM", label: "Mumbai (BOM)" },
  { value: "BLR", label: "Bengaluru (BLR)" },
  { value: "DEL", label: "Delhi (DEL)" }
]
let i = 0
let numbers = []
while (i < 10) {
  numbers.push({
    value: i + 1,
    label: `${i + 1} PAX`
  })
  i++
}

export class SearchFilterForm extends React.Component {
  state = {
    origin: null,
    destination: null,
    passengers: null,
    departureDate: null,
    returnDate: null
  }
  handleChange = (field, selectedOption) => {
    this.setState({ [field]: selectedOption })
  }
  onDepartureDateChange = (date, rawValue) =>
    this.setState({ departureDate: rawValue })
  onReturnDateChange = (date, rawValue) =>
    this.setState({ returnDate: rawValue })

  onSearch = () => {
    const {
      origin,
      destination,
      passengers,
      departureDate,
      returnDate
    } = this.state
    this.props.onSearch({
      origin,
      destination,
      passengers: passengers && passengers.value,
      departureDate,
      returnDate
    })
  }
  render() {
    const {
      origin,
      destination,
      passengers,
      departureDate,
      returnDate
    } = this.state
    const { activeKey } = this.props
    const originCity = destination
      ? city.filter(item => item.label !== destination.label && item)
      : city
    const destinationCity = origin
      ? city.filter(item => item.label !== origin.label && item)
      : city
    return (
      <Row className="sfilter-datepicker">
        <Col sm={6} md={12} className="field">
          <Select
            components={{ DropdownIndicator: () => null }}
            placeholder={"Enter Origin City"}
            value={origin}
            onChange={val => this.handleChange("origin", val)}
            options={originCity}
          />
        </Col>
        <Col sm={6} md={12} className="field">
          <Select
            components={{ DropdownIndicator: () => null }}
            placeholder={"Enter Destination City"}
            value={destination}
            onChange={val => this.handleChange("destination", val)}
            options={destinationCity}
          />
        </Col>
        <Col sm={6} md={12} className="field">
          <DatePicker
            onChange={this.onDepartureDateChange}
            value={departureDate}
            clear={departureDate ? true : false}
            placeholder="Departure Date"
            showDefaultIcon
            dateFormat="YYYY/MM/DD"
          />
        </Col>
        {activeKey === "return" && (
          <Col sm={6} md={12} className="field">
            <DatePicker
              onChange={this.onReturnDateChange}
              value={returnDate}
              clear={returnDate ? true : false}
              placeholder="Return Date"
              showDefaultIcon
              dateFormat="YYYY/MM/DD"
            />
          </Col>
        )}
        <Col sm={6} md={12} className="field">
          <Select
            placeholder={"Select Passenghers"}
            value={passengers}
            onChange={val => this.handleChange("passengers", val)}
            options={numbers}
          />
        </Col>
        <Col sm={12} md={12} className="row field field-buttons">
          <Col sm={6}>
            <button
              type="button"
              className="btn btn-outline-secondary searchBtn"
              onClick={this.onSearch}
            >
              SEARCH
            </button>
          </Col>
          <Col sm={6}>
            <button
              type="button"
              className=" btn btn-outline-secondary searchBtn"
              onClick={() =>
                this.setState({
                  origin: null,
                  destination: null,
                  passengers: null,
                  departureDate: null,
                  returnDate: null
                })
              }
            >
              Clear
            </button>
          </Col>
        </Col>
      </Row>
    )
  }
}

export default SearchFilterForm
