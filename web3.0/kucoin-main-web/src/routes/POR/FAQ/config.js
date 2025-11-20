/**
 * Owner: willen@kupotech.com
 */
export const verifyCode = `
import json
import hashlib
from decimal import Decimal, getcontext

getcontext().prec = 100


def gen_balances(left_balances: dict, right_balances: dict) -> dict:
    """
    Calculate the balances data of the father node
    :param left_balances: data of the left leaf node
    :param right_balances: data of the right leaf node
    :return: data of the father node
    """
    new_balances = {}
    for key in left_balances.keys():
        new_balances[key] = "{0:.100f}".format(
            Decimal(left_balances.get(key, 0)) + Decimal(right_balances.get(key, 0))).rstrip("0").rstrip(".")
    return new_balances


def gen_hash(left_data, right_data, data, height) -> str:
    """
    Calculate the hash data of the father node
    :param left_data: data of the left leaf node
    :param right_data: ata of the right leaf node
    :param data: "path" array data
    :param height: height of the father node
    :return: hash data of the father node
    """
    left_hash = left_data.get("hash")
    right_hash = right_data.get("hash")
    s = ""
    for value in data.values():
        s = s + str(value)
    return hashlib.sha256((left_hash + right_hash + s + str(height)).encode('utf-8')).hexdigest()


def gen_father_data(self_data, data_dict, i) -> dict:
    """
    Calculate the data of the father node
    :param self_data: Current location data
    :param data_dict: All data to be verified
    :return: data of the father node
    """
    self_height = self_data.get("height")
    brother_data = data_dict.get("path")[self_height - 1]
    self_balances = self_data["balances"]
    brother_balances = brother_data["balances"]
    father_height = self_data["height"] + 1
    father_balances = gen_balances(self_balances, brother_balances)

    if brother_data.get("type") % 2 == 0:
        args = (self_data, brother_data, father_balances, father_height)
    else:
        args = (brother_data, self_data, father_balances, father_height)
    father_hash = gen_hash(*args)

    return {
        "balances": father_balances,
        "hash": father_hash,
        "height": father_height
    }


def verify_merkle_path_data(data):
    try:
        data = json.loads(data)
    except Exception:
        print("The data format to be verified is abnormal, Please check the Json data format agin!")
    else:
        self_data = data.get("self")
        root_data = data.get("path")
        root_balances = root_data[-1].get("balances")
        root_hash = root_data[-1].get("hash")
        root_height = root_data[-1].get("height")
        father_data = None
        for i in range(len(data.get("path")) - 1):
            father_data = gen_father_data(self_data, data, i)
            self_data = father_data

        print("*" * 100)
        for i in father_data["balances"].keys():
            print(f'Calculated {i}:{father_data["balances"][i]}; Expected {i}:{root_balances[i]}')
        print(f'Calculated hash:{father_data.get("hash")}; Expected hash:{root_hash}')
        if father_data.get("balances") == root_balances and \
                father_data.get("hash") == root_hash and \
                father_data.get("height") == root_height:
            print(f"Merkle tree path validation passed!")
        else:
            print(f"Merkle tree path validation failed!")
        print("*" * 100)


if __name__ == '__main__':
    data = input("Please enter the data to be verified:")
    verify_merkle_path_data(data)
`;
