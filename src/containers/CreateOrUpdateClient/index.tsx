import { useState } from "react";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";
import axios from "axios";
import { useRouter } from "next/router";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Divider,
  Row,
  Col,
} from "antd";
import {
  DeleteFilled,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { getCities, getStates } from "@brazilian-utils/brazilian-utils";

const CreateOrUpdateClient = () => {
  const { push } = useRouter();
  const [form] = useForm();

  const [emails, setEmails] = useState([1]);

  const addEmail = () => {
    setEmails((old) => [...old, old.length + 1]);
  };

  return (
    <Form
      form={form}
      validateMessages={{
        required: "Campo obrigatório",
      }}
      style={{ paddingLeft: 20, paddingRight: 20 }}
      layout="vertical"
      initialValues={{
        name: "",
        birthday: "",
        driverLicenseNumber: "",
        diverLicenseIssuedAt: "",
        state: null,
        city: null,
        phones: [""],
        emails: [""],
        parentName: "",
        parentPhone: "",
      }}
      onValuesChange={(values) => {
        if (values.state) {
          form.setFieldsValue({ city: null });
        }
      }}
      onFinish={async (formData) => {
        console.log({ formData });
        await axios.post("../api/customers/create", {
          customer: {
            name: formData.name,
            birthday: moment(formData.birthday).format("DD/MM/YYYY"),
            driver_license:
              moment().diff(formData.birthday, "years", false) >= 18
                ? {
                    number: formData.driverLicenseNumber,
                    issued_at:
                      moment(formData.diverLicenseIssuedAt).format(
                        "DD/MM/YYYY"
                      ) ?? formData.diverLicenseIssuedAt,
                  }
                : null,
            state: formData.state,
            city: formData.city,
            phones: formData.phones.map((phone: string, index: number) => ({
              id: index + 1,
              code: phone.substring(0, 2),
              number: phone.substring(2),
            })),
            emails: formData.emails.map((email: string, index: number) => ({
              id: index + 1,
              address: email,
            })),
            parent:
              moment().diff(formData.birthday, "years", false) < 18
                ? {
                    name: formData.parentName,
                    phone: {
                      code: formData.parentPhone.substring(0, 2),
                      number: formData.parentPhone.substring(2),
                    },
                  }
                : null,
          },
        });

        push("/clientes");
      }}
    >
      <Form.Item
        name="name"
        label="Nome"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item
        name="birthday"
        label="Data de nascimento"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <DatePicker
          placeholder="Selecionar data"
          format="DD/MM/YYYY"
          style={{ width: "100%" }}
        />
      </Form.Item>
      <Row gutter={10} align="bottom" style={{ width: "100%" }}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="driverLicenseNumber"
            label="Carteira de motorista"
            dependencies={["birthday"]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const isOver18 =
                    moment().diff(getFieldValue("birthday"), "years", false) >=
                    18;
                  if (isOver18 && !value)
                    return Promise.reject(
                      new Error("Campo obrigatório para maiores de 18 anos")
                    );

                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input type="text" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="diverLicenseIssuedAt"
            label=""
            dependencies={["birthday"]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const isOver18 =
                    moment().diff(getFieldValue("birthday"), "years", false) >=
                    18;
                  if (isOver18 && !value)
                    return Promise.reject(
                      new Error("Campo obrigatório para maiores de 18 anos")
                    );

                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DatePicker
              placeholder="Selecionar data"
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="state" label="Estado">
        <Select showSearch>
          {getStates().map((state) => (
            <Select.Option key={state.code} value={state.code}>
              {state.code}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="city"
        label="Cidade"
        dependencies={["state", "driverLicenseNumber"]}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              const isStateRN = getFieldValue("state") === "RN";
              const doesLicenseStartsWith6 = (
                getFieldValue("driverLicenseNumber") as string
              ).startsWith("6");
              if (isStateRN && doesLicenseStartsWith6)
                return Promise.reject(new Error("Campo obrigatório"));

              return Promise.resolve();
            },
          }),
        ]}
      >
        <Select showSearch>
          {getCities(form.getFieldValue("state")).map((city) => (
            <Select.Option key={city} value={city}>
              {city}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Divider orientation="left">Telefones</Divider>

      <Form.List
        name="phones"
        rules={[
          {
            validator: async (_, phones) => {
              if (phones.every((p: string) => !p)) {
                return Promise.reject(
                  new Error("Adicione pelo menos um telefone")
                );
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item required={false} key={field.key}>
                <Form.Item
                  {...field}
                  validateTrigger={["onChange", "onBlur"]}
                  noStyle
                >
                  <Input
                    type="text"
                    style={
                      fields.length > 1
                        ? { width: "85%", marginRight: "5%" }
                        : undefined
                    }
                  />
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                ) : null}
              </Form.Item>
            ))}
            {fields.length < 4 && (
              <Form.Item>
                <Button onClick={() => add()} icon={<PlusOutlined />}>
                  Adicionar Telefone
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            )}
          </>
        )}
      </Form.List>

      <Divider orientation="left">E-mails</Divider>

      <Form.List
        name="emails"
        rules={[
          {
            validator: async (_, emails) => {
              if (emails.every((e: string) => !e)) {
                return Promise.reject(
                  new Error("Adicione pelo menos um e-mail")
                );
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item required={false} key={field.key}>
                <Form.Item
                  {...field}
                  validateTrigger={["onChange", "onBlur"]}
                  noStyle
                >
                  <Input
                    type="text"
                    style={
                      fields.length > 1
                        ? { width: "85%", marginRight: "5%" }
                        : undefined
                    }
                  />
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                ) : null}
              </Form.Item>
            ))}
            {fields.length < 3 && (
              <Form.Item>
                <Button onClick={() => add()} icon={<PlusOutlined />}>
                  Adicionar E-mail
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            )}
          </>
        )}
      </Form.List>

      <Divider orientation="left">Responsável</Divider>
      <Form.Item
        name="parentName"
        label="Nome"
        dependencies={["birthday"]}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              const isUnder18 =
                moment().diff(getFieldValue("birthday"), "years", false) < 18;
              if (isUnder18 && !value)
                return Promise.reject(
                  new Error("Campo obrigatório para menores de 18 anos")
                );

              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="parentPhone"
        label="Telefone"
        dependencies={["birthday"]}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              const isUnder18 =
                moment().diff(getFieldValue("birthday"), "years", false) < 18;
              if (isUnder18 && !value)
                return Promise.reject(
                  new Error("Campo obrigatório para menores de 18 anos")
                );

              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary">
          Salvar cliente
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateOrUpdateClient;
