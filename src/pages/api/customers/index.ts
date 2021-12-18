import type { NextApiRequest, NextApiResponse } from "next";

import { Customer, customersRepo } from "../../../helpers/customer-repo";

export default function handle(
  req: NextApiRequest,
  res: NextApiResponse<Customer[]>
) {
  return res.status(200).json(customersRepo.getAll());
}
