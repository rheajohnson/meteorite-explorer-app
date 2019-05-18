import React from "react";
import { Layout } from "antd";
import { Table, Typography, Input, Button, Icon } from "antd";
import Highlighter from "react-highlight-words";
import Moment from "react-moment";
import "./App.css";

const { Header, Footer, Content } = Layout;
const { Title } = Typography;
const Search = Input.Search;

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loading: false,
      searchInput: "",
      searchText: ""
    };
  }

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
            nametype
            recclass
            mass
            fall
            year
          }
        }
      `
    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(response => {
        console.log(response);
        if (!response.length) {
          console.log("no response :(");
          this.setState({ loading: false });
          return;
        }
        const data = response.data.landings.map(value => {
          const dateToFormat = value.year;
          const formattedDate = <Moment format="YYYY">{dateToFormat}</Moment>;
          return { ...value, key: value.id, formattedDate };
        });
        this.setState({ data }, () => this.setState({ loading: false }));
      })
      .catch(() => {
        console.log("something went wrong");
      });
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : null}
      />
    )
  });

  columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...this.getColumnSearchProps("name")
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      ...this.getColumnSearchProps("id")
    },
    {
      title: "nametype",
      dataIndex: "nametype",
      key: "nametype",
      ...this.getColumnSearchProps("nametype")
    },
    {
      title: "Recclass",
      dataIndex: "recclass",
      key: "recclass",
      ...this.getColumnSearchProps("recclass")
    },
    {
      title: "Mass (g)",
      dataIndex: "mass",
      key: "mass",
      ...this.getColumnSearchProps("mass")
    },
    {
      title: "Fall",
      dataIndex: "fall",
      key: "fall"
    },
    {
      title: "Year",
      dataIndex: "formattedDate",
      key: "formattedDate"
    }
  ];

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  setSearchInput = text => {
    console.log(text);
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
            onSearch={value => console.log(value)}
          />
          <Table
            className="table-container"
            columns={this.columns}
            dataSource={this.state.data}
            size="small"
            loading={this.state.loading}
          />
        </Content>
        <Footer className="footer-container" />
      </Layout>
    );
  }
}
