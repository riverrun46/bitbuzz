import { UserInfo } from "../store/user";
import { Connector } from "../types";
import { environment } from "../utils/environments";

export async function getUser(
  connector: Connector,
  address?: string,
): Promise<UserInfo | null> {
  if (!address) {
    return null
  }

  const network = environment.network
  return connector.getUser({
    network,
    currentAddress: address,
  })
}