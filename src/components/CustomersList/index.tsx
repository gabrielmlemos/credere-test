import { List, Avatar } from "antd";

import { Customer } from "../../helpers/customer-repo";

interface IProps {
  customers?: Customer[];
  isFetching: boolean;
}

const CustomersList = ({ customers, isFetching }: IProps) => {
  return (
    <List
      style={{ paddingLeft: 20, paddingRight: 20 }}
      loading={isFetching}
      itemLayout="horizontal"
      dataSource={customers}
      renderItem={({ name, ...rest }) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title={<a href="https://ant.design">{name}</a>}
            description={JSON.stringify(rest, null, 2)}
          />
        </List.Item>
      )}
    />
  );
};

export default CustomersList;
