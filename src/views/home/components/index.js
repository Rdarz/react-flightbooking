import React, { Component } from "react"
import "views/home/HomeStyle.scss"
import Header from "views/partials/header"
import SearchFilter from "views/partials/searchFilter"
import { Row, Col } from "react-bootstrap"
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory from "react-bootstrap-table2-paginator"
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css"

import { timeDiff, timeCovertTo12hrs } from "common/utils/Validator"
export class Home extends Component {
  state = {
    flightList: null,
    returnFlightList: null,
    journey: null
  }
  componentDidMount() {
    this.getFlightDetails()
  }
  getFlightDetails = () => {
    const { getFlightDetails } = this.props
    getFlightDetails().then(res => {
      const result = res.data.map((item, i) => {
        return { ...item, index: i + 1 }
      })
      this.setState({
        masterList: result,
        flightList: result
      })
    })
  }

  getDirectFlight = async (type, val) => {
    const { masterList } = this.state
    const flightList = await masterList
    const result = await flightList.filter(item => {
      return (
        item.date ===
          (type === "return" ? val.returnDate : val.departureDate) &&
        item.origin ===
          (type === "return" ? val.destination.label : val.origin.label) &&
        item.destination ===
          (type === "return" ? val.origin.label : val.destination.label)
      )
    })
    return result
  }

  getMultipleFlight = async (type, val) => {
    const { masterList } = this.state
    const flightList = await masterList
    const multiAirline = []
    let sameDestination = await flightList.filter(item => {
      return (
        item.date ===
          (type === "return" ? val.returnDate : val.departureDate) &&
        item.destination ===
          (type === "return" ? val.origin.label : val.destination.label) &&
        item.origin !==
          (type === "return" ? val.destination.label : val.origin.label) &&
        item
      )
    })
    let sameOrigin = await flightList.filter(
      item =>
        item.date ===
          (type === "return" ? val.returnDate : val.departureDate) &&
        item.origin ===
          (type === "return" ? val.destination.label : val.origin.label) &&
        item.destination !==
          (type === "return" ? val.origin.label : val.destination.label) &&
        item
    )

    await sameOrigin.map(result => {
      sameDestination.map(async (obj, i) => {
        const flightDiff = await timeDiff(
          type === "return" ? val.returnDate : val.departureDate,
          type === "return" ? obj.arrivalTime : result.arrivalTime,
          type === "return" ? result.departureTime : obj.departureTime
        )

        await (obj.origin === result.destination &&
          flightDiff.time > "00:30" &&
          // timeDiff < "08:00" &&
          multiAirline.push({
            arrivalTime:
              type === "return" ? result.arrivalTime : obj.arrivalTime, //
            date: result.date,
            departureTime:
              type === "return" ? obj.departureTime : result.departureTime, //
            destination:
              type === "return" ? result.destination : obj.destination, //
            flightNo: `${result.name}, ${obj.name}`,
            name: `Multiple`,
            origin: type === "return" ? obj.origin : result.origin, //
            price: val.passengers
              ? (result.price + obj.price) * val.passengers
              : result.price + obj.price,
            layoverTime: flightDiff, //
            passengers: val.passengers,
            flights: type === "return" ? [obj, result] : [result, obj]
          }))
      })
    })
    return multiAirline
  }

  getNonExpandableRow = (type, data) => {
    const list =
      data &&
      data.map((item, i) => {
        return !item.flights && i + 1
      })
    return list
  }

  renderExpandRow = row => {
    return (
      <div>
        <Row
          sm={12}
          className={"layoverStrip"}
        >{`Layover time ${row.layoverTime.hours}h ${row.layoverTime.minutes}m`}</Row>
        {row.flights.map((f, i) => {
          return (
            <Row
              index={i}
              sm={12}
              className={`multipleFlight ${i === 0 && "border-bottom"}`}
            >
              <Col sm={3} className="f-name">
                <div>{f.name}</div>
                <div className="note">{f.flightNo}</div>
              </Col>
              <Col sm={3} className="f-departure">
                <div>{timeCovertTo12hrs(f.departureTime)}</div>
                <div className="note">{f.origin}</div>
              </Col>
              <Col sm={3} className="f-duration">
                <div>{`${
                  timeDiff(f.date, f.departureTime, f.arrivalTime).hours
                }h ${timeDiff(f.date, f.departureTime, f.arrivalTime).minutes}m
                    `}</div>
                <div className="note">{"Travel time"}</div>
              </Col>
              <Col sm={3} className="f-arrival">
                <div>{timeCovertTo12hrs(f.arrivalTime)}</div>
                <div className="note">{f.destination}</div>
              </Col>
            </Row>
          )
        })}
      </div>
    )
  }

  onSearch = async val => {
    let singleJourney = await (val.departureDate &&
      this.getDirectFlight("single", val))
    let returnJourney = await (val.returnDate &&
      this.getDirectFlight("return", val))

    const singleJourneyMultiAir = await this.getMultipleFlight("single", val)
    let returnJourneyMultiAir = {}
    if (val.returnDate) {
      returnJourneyMultiAir = await this.getMultipleFlight("return", val)
    }

    const singleJourneyResult = await [
      ...singleJourney,
      ...singleJourneyMultiAir
    ].map((item, i) => {
      return { ...item, index: i + 1 }
    })

    const returnJourneyResult = await (returnJourney &&
      returnJourneyMultiAir &&
      [...returnJourney, ...returnJourneyMultiAir].map((item, i) => {
        return { ...item, index: i + 1 }
      }))

    await this.setState({
      flightList: singleJourneyResult,
      returnFlightList: returnJourneyResult,
      journey: {
        destination: val.destination.label,
        origin: val.origin.label
      }
    })
  }

  render() {
    const { flightList, returnFlightList } = this.state

    const columns = [
      {
        dataField: "",
        text: "",
        headerStyle: (colum, colIndex) => {
          return { width: "5%", textAlign: "center", border: "0" }
        },
        formatter: (value, row) => (
          <div className="f-name">
            <div className="note icon">
              {row.flights ? (
                <i
                  className={
                    returnFlightList
                      ? "fa fa-chevron-down responsive"
                      : "fa fa-chevron-down"
                  }
                ></i>
              ) : (
                <i
                  className={
                    returnFlightList ? "fa fa-plane responsive" : "fa fa-plane"
                  }
                ></i>
              )}
            </div>
          </div>
        )
      },
      {
        dataField: "name",
        text: "",
        headerStyle: (colum, colIndex) => {
          return { textAlign: "center", border: "0" }
        },
        formatter: (value, row) => (
          <div className="f-name">
            <div>{value}</div>
            <div className="note">{row.flightNo}</div>
          </div>
        )
      },
      {
        dataField: "departureTime",
        text: "",
        headerStyle: (colum, colIndex) => {
          return { textAlign: "center", border: "0" }
        },
        formatter: (value, row) => (
          <div className="f-departure">
            <div>{timeCovertTo12hrs(value)}</div>
            <div className="note">{row.origin}</div>
          </div>
        )
      },
      {
        dataField: "",
        text: "",
        headerStyle: (colum, colIndex) => {
          return { textAlign: "center", border: "0" }
        },
        formatter: (value, row) => {
          return (
            <div className="f-duration">
              <div>{`${
                timeDiff(row.date, row.departureTime, row.arrivalTime).hours
              }h ${
                timeDiff(row.date, row.departureTime, row.arrivalTime).minutes
              }m`}</div>
              <div className="note">{"Travel time"}</div>
            </div>
          )
        }
      },
      {
        dataField: "arrivalTime",
        text: "",
        headerStyle: (colum, colIndex) => {
          return { textAlign: "center", border: "0" }
        },
        formatter: (value, row) => (
          <div className="f-arrival">
            <div>{timeCovertTo12hrs(value)}</div>
            <div className="note">{row.destination}</div>
          </div>
        )
      },

      {
        dataField: "price",
        text: "",
        headerStyle: (colum, colIndex) => {
          return { textAlign: "center", border: "0" }
        },
        sort: true,
        formatter: (value, row) => {
          return (
            <div className="f-price">
              <div>
                <span>&#8377;</span>
                {value}
              </div>
              <div className="note">
                {row.passengers ? `${row.passengers} PAX` : "1 PAX"}
              </div>
            </div>
          )
        }
      },
      {
        dataField: "",
        text: "",
        headerStyle: (colum, colIndex) => {
          return { textAlign: "center", border: "0" }
        },
        formatter: (value, row) => (
          <button type="button" className="btn btn-outline-secondary searchBtn">
            BOOK
          </button>
        )
      }
    ]
    const NonExpandableSingle = this.getNonExpandableRow("single", flightList)
    const NonExpandableReturn = this.getNonExpandableRow(
      "return",
      returnFlightList
    )

    const exapandRowSingle = {
      renderer: row => this.renderExpandRow(row),
      onlyOneExpanding: true,
      nonExpandable: NonExpandableSingle
    }
    const expandRowReturn = {
      renderer: row => this.renderExpandRow(row),
      onlyOneExpanding: true,
      nonExpandable: NonExpandableReturn
    }

    const CaptionElementSingle = () => (
      <h3 className="caption-title">
        {this.state.journey ? (
          <div>
            <span>{`${this.state.journey.origin} `}</span>
            <i className="fa fa-arrow-right"></i>
            <span>{` ${this.state.journey.destination}`}</span>
          </div>
        ) : (
          "Search flights"
        )}
      </h3>
    )
    const CaptionElementReturn = () => (
      <h3 className="caption-title">
        {this.state.journey ? (
          <div>
            <span>{`${this.state.journey.destination} `}</span>
            <i className="fa fa-arrow-right"></i>
            <span>{` ${this.state.journey.origin}`}</span>
          </div>
        ) : (
          "Search flights"
        )}
      </h3>
    )
    return (
      <div className="sflight">
        <Header />
        <Row
          className={`${
            returnFlightList ? "scontainer scontainer-fluid" : "scontainer"
          } `}
        >
          <Col className="sfilter" sm={12} md={3}>
            <SearchFilter onSearch={this.onSearch} />
          </Col>
          <Col className="sresult row" sm={12} md={9}>
            {flightList && (
              <Col
                className={
                  returnFlightList
                    ? "sresult-col responsive-col"
                    : "sresult-col"
                }
                sm={12}
                md={12}
                lg={returnFlightList ? 6 : 12}
              >
                <BootstrapTable
                  keyField="index"
                  data={flightList || []}
                  columns={columns}
                  rowClasses="sresult-row"
                  hover
                  pagination={paginationFactory()}
                  expandRow={exapandRowSingle}
                  noDataIndication="No flights available"
                  caption={<CaptionElementSingle />}
                />
              </Col>
            )}
            {returnFlightList && (
              <Col
                className={
                  returnFlightList
                    ? "sresult-col responsive-col"
                    : "sresult-col"
                }
                sm={12}
                md={12}
                lg={returnFlightList ? 6 : 12}
              >
                <BootstrapTable
                  keyField="index"
                  data={returnFlightList || []}
                  columns={columns}
                  rowClasses="sresult-row"
                  hover
                  pagination={paginationFactory()}
                  expandRow={expandRowReturn}
                  noDataIndication="No flights available"
                  caption={<CaptionElementReturn />}
                />
              </Col>
            )}
          </Col>
        </Row>
      </div>
    )
  }
}
export default Home
