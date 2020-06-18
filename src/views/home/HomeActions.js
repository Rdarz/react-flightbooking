export const GET_FLIGHT_DETAILS = "GET_FLIGHT_DETAILS"

export const getFlightDetailsSuccess = payload => {
  return {
    type: GET_FLIGHT_DETAILS,
    payload
  }
}
