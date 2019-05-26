import React from "react";
import { Layout } from "antd";
import { Table, Typography, Input, message, Button } from "antd";
import Highlighter from "react-highlight-words";
import Moment from "react-moment";
import "./App.css";

//importing compontents from antd
const { Header, Footer, Content } = Layout;
const { Title } = Typography;
const Search = Input.Search;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      filteredDb: [],
      loading: false,
      searchInput: ""
    };
  }

  //table columns
  columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: text => (
        //name item will highlight if there is a match
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchInput]}
          textToHighlight={text ? text.toString() : null}
        />
      )
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id"
    },

    {
      title: "Recclass",
      dataIndex: "recclass",
      key: "recclass"
    },
    {
      title: "Mass (g)",
      dataIndex: "mass",
      key: "mass"
    },

    {
      title: "Year",
      dataIndex: "formattedDate",
      key: "formattedDate"
    },

    {
      title: "Latitude",
      dataIndex: "reclat",
      key: "reclat"
    },

    {
      title: "Longitude",
      dataIndex: "reclong",
      key: "reclong"
    }
  ];

  componentDidMount() {
    this.getLandings();
  }

  getLandings() {
    this.setState({ loading: true });
    const reqBody = {
      query: `
        query {
          landings {
            name
            id
            recclass
            reclat
            reclong
            mass
            year
          }
        }
      `
    };

    fetch("/graphql", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(response => {
        if (!response.data) {
          message.error("Failed to fetch data 😭");
          this.setState({ loading: false });
          return;
        }
        message.success("Successfully grabbed data 😄");
        const data = response.data.landings.map(value => {
          const dateToFormat = value.year;
          const formattedDate = <Moment format="YYYY">{dateToFormat}</Moment>;
          return { ...value, key: value.id, formattedDate };
        });
        this.setState({ data, filteredDb: data }, () => {
          this.setState({ loading: false });
        });
      })
      .catch(() => {
        message.error("Failed to fetch data 😭");
        this.setState({ loading: false });
        return;
      });
  }

  onSearch = text => {
    if (text.length === 0) {
      this.setState({ loading: true, filteredDb: this.state.data }, () => {
        this.setState({ loading: false });
      });
      return;
    }
    let filteredInput = this.state.data.filter(value => {
      return (
        value.name.toLowerCase().includes(text.toLowerCase()) &&
        value.name.toLowerCase().charAt(0) === text.toLowerCase().charAt(0)
      );
    });
    this.setState({ loading: true, filteredDb: filteredInput }, () => {
      this.setState({ loading: false });
    });
    if (filteredInput.length === 0) {
      message.error("No search results found 😮");
    }
  };

  setInputValue = e => {
    //searchInput is used when highlighting row, only if 2 or more characters match
    if (e.target.value.length < 2) {
      if (this.state.searchInput.length > 0) {
        this.setState({ searchInput: "" });
      }
      return;
    }
    const value = e.target.value;
    this.setState({ searchInput: value });
  };

  render() {
    return (
      <Layout className="app-container">
        <Header className="header-container">
          <Title level={3} style={{ color: "white" }}>
            Meteorite Explorer
          </Title>
        </Header>
        <Content className="content-container">
          <Search
            placeholder="Search meteor name"
            className="search-container"
            enterButton="Search"
            size="large"
            onSearch={value => this.onSearch(value)}
            onChange={this.setInputValue}
          />
          <Table
            className="table-container"
            columns={this.columns}
            dataSource={this.state.filteredDb}
            size="small"
            loading={this.state.loading}
            scroll={{ x: 700 }}
          />
        </Content>
        <Footer className="footer-container">
          <Button
            size="small"
            type="primary"
            href="https://github.com/rjohnson91/meteorite-explorer-app"
            target="_blank"
          >
            View GitHub
          </Button>
        </Footer>
      </Layout>
    );
  }
}

export default App;
