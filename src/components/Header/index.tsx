import { PageHeader, Button } from "antd";
import Link from "next/link";

interface IProps {
  title: string;
}

const Header = ({ title }: IProps) => {
  return (
    <PageHeader
      style={{ width: "100%" }}
      title={title}
      extra={[
        <Button key="3">
          <Link href="/clientes">Clientes</Link>
        </Button>,
        <Button key="2" type="primary">
          <Link href="/clientes/criar">Novo Cliente</Link>
        </Button>,
      ]}
    />
  );
};

export default Header;
