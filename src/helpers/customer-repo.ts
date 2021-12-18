const fs = require("fs");

let customers: Array<Customer> = require("../data/customers.json");

export type Phone = {
  id: number;
  code: string;
  number: string;
};

export type Customer = {
  id: number;
  name: string;
  birthday: string;
  driver_license: {
    id: number;
    number: string;
    issued_at: string;
  };
  state: string;
  city: string;
  phones: Array<Phone>;
  emails: Array<{
    id: number;
    address: string;
  }>;
  parent: null | {
    id: number;
    name: string;
    phone: Phone;
  };
};

export const customersRepo = {
  getAll: () => customers,
  getById: (id: number) =>
    customers.find((x) => x.id.toString() === id.toString()),
  create,
  update,
};

function create(customer: Customer) {
  const id = customers.length
    ? Math.max(...customers.map((x: Customer) => x.id)) + 1
    : 1;

  customers.push({
    ...customer,
    id,
    driver_license: { ...customer.driver_license, id },
  });
  saveData();
}

function update(id: number, params: Partial<Customer>) {
  const customer = customers.find(
    (x: Customer) => x.id.toString() === id.toString()
  );

  Object.assign(customer, params);
  saveData();
}

function saveData() {
  fs.writeFileSync(
    "src/data/customers.json",
    JSON.stringify(customers, null, 4)
  );
}
