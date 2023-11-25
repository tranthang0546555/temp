pragma solidity ^0.8.9;

contract MedicalRecordV2 {
    event CreateMedicalRecord(address sender, uint256 recordId);
    event EditMedicalRecord(uint256 recordId);
    event DeleteMedicalRecord(uint256 recordId);
    event RestoreMedicalRecord(uint256 recordId);

    struct Record {
        uint256 id;
        address walletId;
        string data;
        bool isDeleted;
        string userId;
        string doctorId;
        uint256 createdAt;
        uint256 updatedAt;
    }

    Record[] private medicalRecords;
    mapping(uint256 => address) recordToOwner;

    function createMedicalRecord(
        string memory data,
        string memory userId,
        string memory doctorId
    ) external {
        uint256 recordId = medicalRecords.length;
        medicalRecords.push(
            Record(
                recordId,
                msg.sender,
                data,
                false,
                userId,
                doctorId,
                block.timestamp,
                block.timestamp
            )
        );
        recordToOwner[recordId] = msg.sender;
        emit CreateMedicalRecord(msg.sender, recordId);
    }

    function getRecordsbyUserId(string memory userId)
        external
        view
        returns (Record[] memory)
    {
        Record[] memory temp = new Record[](medicalRecords.length);
        uint256 counter = 0;
        for (uint256 i = 0; i < medicalRecords.length; i++) {
            if (
                keccak256(abi.encode(medicalRecords[i].userId)) ==
                keccak256(abi.encode(userId))
            ) {
                temp[counter] = medicalRecords[i];
                counter++;
            }
        }
        Record[] memory result = new Record[](counter);
        for (uint256 i = 0; i < counter; i++) result[i] = temp[i];
        return result;
    }

    function getRecordsbyDoctorId(string memory doctorId)
        external
        view
        returns (Record[] memory)
    {
        Record[] memory temp = new Record[](medicalRecords.length);
        uint256 counter = 0;
        for (uint256 i = 0; i < medicalRecords.length; i++) {
            if (
                keccak256(abi.encode(medicalRecords[i].doctorId)) ==
                keccak256(abi.encode(doctorId))
            ) {
                temp[counter] = medicalRecords[i];
                counter++;
            }
        }
        Record[] memory result = new Record[](counter);
        for (uint256 i = 0; i < counter; i++) result[i] = temp[i];
        return result;
    }

    function editMedicalRecord(uint256 id, string memory data)
        external
        returns (bool)
    {
        if (recordToOwner[id] == msg.sender) {
            medicalRecords[id].data = data;
            medicalRecords[id].updatedAt = block.timestamp;
            emit EditMedicalRecord(id);
            return true;
        }
        return false;
    }

    function deleteMedicalRecord(uint256 id) external returns (bool) {
        if (recordToOwner[id] == msg.sender) {
            medicalRecords[id].isDeleted = true;
            emit DeleteMedicalRecord(id);
            return true;
        }
        return false;
    }

    function restoreMedicalRecord(uint256 id) external returns (bool) {
        if (recordToOwner[id] == msg.sender) {
            medicalRecords[id].isDeleted = false;
            emit RestoreMedicalRecord(id);
            return true;
        }
        return false;
    }

    // function getAll() external view returns (Record[] memory) {
    //     Record[] memory result = new Record[](medicalRecords.length);
    //     for (uint256 i = 0; i < medicalRecords.length; i++) {
    //         result[i] = medicalRecords[i];
    //     }
    //     return result;
    // }

    function getMedicalRecord(uint256 id)
        external
        view
        returns (Record memory)
    {
        return medicalRecords[id];
    }
}
