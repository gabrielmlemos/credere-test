import type { NextApiRequest, NextApiResponse } from "next";

import { Customer, customersRepo } from "../../../helpers/customer-repo";

export default function handle(
  req: NextApiRequest,
  res: NextApiResponse<Customer>
) {
  // split out password from user details
  const { customer }: { customer: Customer } = req.body;

  console.log(req.body);

  // validate
  const customers = customersRepo.getAll();
  if (customers.find((c) => c.name === customer.name))
    throw `Cliente "${customer.name}" já existe`;

  customersRepo.create(customer);
  return res.status(200).json(customer);
}
