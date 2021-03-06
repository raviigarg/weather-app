import React, { Component } from 'react'
import axios from 'axios'
import { AutoComplete, Button, Col, Icon, Input, Layout, Row } from 'antd'

const { Header } = Layout
const { Option } = AutoComplete

// Get environment variables.
const { REACT_APP_AUTOCOMPLETE_URI, REACT_APP_PLACE_DETAILS_URI } = process.env

// Brand styling.
const topBarBrandStyle = {
  color: 'White',
  fontFamily: 'Spirax',
  fontSize: 40,
  textAlign: 'center',
}

class TopBar extends Component {
  state = {
    cities: [],
  }

  handleSearch = async value => {
    const requestURI = `${REACT_APP_AUTOCOMPLETE_URI}&query=${value}`
    try {
      const response = await axios.get(requestURI)
      const { suggestions } = response.data

      if (suggestions !== undefined) {
        const cities = suggestions.map(suggestion => (
          <Option key={suggestion.locationId} value={suggestion.locationId} label={suggestion.label}>
            {suggestion.label}
          </Option>
        ))

        this.setState({ cities })
      }
    } catch (err) {
      console.error(err)
    }
  }

  handleSelect = async locationId => {
    const requestURI = `${REACT_APP_PLACE_DETAILS_URI}&locationid=${locationId}`

    try {
      const response = await axios.get(requestURI)
      const { Latitude, Longitude } = response.data.Response.View[0].Result[0].Location.DisplayPosition

      console.log(Latitude)
      console.log(Longitude)

      // TODO: Add card.
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    const { cities } = this.state

    return (
      <Header>
        <Row>
          <Col span={8}>
            <AutoComplete
              dataSource={cities}
              onSelect={this.handleSelect}
              onSearch={this.handleSearch}
              optionLabelProp="label"
              placeholder="City, state, country"
            >
              <Input suffix={<Icon type="search" />} />
            </AutoComplete>
          </Col>
          <Col span={8} style={topBarBrandStyle}>
            Weather
          </Col>
          <Col span={8} style={{ textAlign: 'end' }}>
            <Button type="primary" icon="tool" shape="circle" />
          </Col>
        </Row>
      </Header>
    )
  }
}

export default TopBar
