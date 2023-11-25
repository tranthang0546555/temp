import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

describe("MedicalRecord Contract", function () {
  let MedicalRecord;
  let medicalRecord: Contract;
  let owner: SignerWithAddress,
    add1: SignerWithAddress,
    add2: SignerWithAddress;
  ``;

  const TOTAL_MEDICAL_RECORD_USER_1_DOCTOR_1 = 2;
  const TOTAL_MEDICAL_RECORD_USER_2_DOCTOR_1 = 2;
  const TOTAL_MEDICAL_RECORD_USER_1_DOCTOR_2 = 2;
  const TOTAL_MEDICAL_RECORD_USER_2_DOCTOR_2 = 3;

  const TOTAL_MEDICAL_RECORD_DOCTOR_1 =
    TOTAL_MEDICAL_RECORD_USER_1_DOCTOR_1 + TOTAL_MEDICAL_RECORD_USER_2_DOCTOR_1;
  const TOTAL_MEDICAL_RECORD_DOCTOR_2 =
    TOTAL_MEDICAL_RECORD_USER_1_DOCTOR_2 + TOTAL_MEDICAL_RECORD_USER_2_DOCTOR_2;

  let data = {
    fullName: "Thang",
    birthday: "10/05/2000",
    gender: "Nam",
    jog: "Student",
    location: "DN",
    phone: "0333333333",
    idNumber: "socancuoc",
    dayIn: "19/12/2022",
    medicalHistory: "Bệnh sử, ... xyz",
    reason: "Lý do khám bệnh: ...xyz",
    status: "Thể trạng trước khi khám: ...xyz",
    diagnostic: "Chuẩn đoán bệnh: bị abc ... xyz",
    treatment: "Phương pháp điều trị: ...xyz",
    userId: "thang1",
    doctorId: "doctor1",
  };

  let totalRecords = [];

  this.beforeEach(async function () {
    MedicalRecord = await ethers.getContractFactory("MedicalRecordV2");
    let [myAdd, addr1, addr2] = await ethers.getSigners();
    (owner = myAdd), (add1 = addr1), (add2 = addr2);
    medicalRecord = await MedicalRecord.deploy();

    for (let i = 0; i < TOTAL_MEDICAL_RECORD_USER_1_DOCTOR_1; i++) {
      let record = {
        walletId: add1.address,
        data: JSON.stringify({
          ...data,
          userId: "Thang1",
          doctorId: "doctor1",
        }),
        isDeleted: false,
        userId: "thang1",
        doctorId: "doctor1",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await medicalRecord
        .connect(add1)
        .createMedicalRecord(record.data, record.userId, record.doctorId);
      totalRecords.push(record);
    }

    for (let i = 0; i < TOTAL_MEDICAL_RECORD_USER_2_DOCTOR_1; i++) {
      let record = {
        walletId: add1.address,
        data: JSON.stringify({
          ...data,
          userId: "Thang2",
          doctorId: "doctor1",
        }),
        isDeleted: false,
        userId: "thang2",
        doctorId: "doctor1",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await medicalRecord
        .connect(add1)
        .createMedicalRecord(record.data, record.userId, record.doctorId);
      totalRecords.push(record);
    }

    for (let i = 0; i < TOTAL_MEDICAL_RECORD_USER_1_DOCTOR_2; i++) {
      let record = {
        walletId: add1.address,
        data: JSON.stringify({
          ...data,
          userId: "Thang2",
          doctorId: "doctor1",
        }),
        isDeleted: false,
        userId: "thang1",
        doctorId: "doctor2",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await medicalRecord
        .connect(add2)
        .createMedicalRecord(record.data, record.userId, record.doctorId);
      totalRecords.push(record);
    }
    for (let i = 0; i < TOTAL_MEDICAL_RECORD_USER_2_DOCTOR_2; i++) {
      let record = {
        walletId: add1.address,
        data: JSON.stringify({
          ...data,
          userId: "Thang2",
          doctorId: "doctor1",
        }),
        isDeleted: false,
        userId: "thang2",
        doctorId: "doctor2",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await medicalRecord
        .connect(add2)
        .createMedicalRecord(record.data, record.userId, record.doctorId);
      totalRecords.push(record);
    }
  });

  describe("Create medical record", function () {
    it("emit createMedicalRecord event", async function () {
      let record = {
        data: JSON.stringify({
          ...data,
          userId: "Thang1",
          doctorId: "doctor2",
        }),
        userId: "Thang2",
        doctorId: "doctor3",
        isDeleted: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await expect(
        await medicalRecord.createMedicalRecord(
          record.data,
          record.userId,
          record.doctorId
        )
      )
        .to.emit(medicalRecord, "CreateMedicalRecord")
        .withArgs(
          owner.address,
          TOTAL_MEDICAL_RECORD_DOCTOR_1 + TOTAL_MEDICAL_RECORD_DOCTOR_2
        );
    });
  });

  describe("Get medical records doctor_1", function () {
    it("return total records doctor_1", async () => {
      const records = await medicalRecord.getRecordsbyDoctorId("doctor1");
      // console.log("records", records);
      expect(records.length).to.equal(TOTAL_MEDICAL_RECORD_DOCTOR_1);
    });
  });

  describe("Get medical records doctor_2", function () {
    it("return total records doctor_2", async () => {
      const records = await medicalRecord.getRecordsbyDoctorId("doctor2");
      // console.log("doctor_2", records);
      expect(records.length).to.equal(TOTAL_MEDICAL_RECORD_DOCTOR_2);
    });
  });

  describe("Get medical records user_1", function () {
    it("return total records thang1", async () => {
      const records = await medicalRecord.getRecordsbyUserId("thang1");
      // console.log("thang1", records);
      expect(records.length).to.equal(
        TOTAL_MEDICAL_RECORD_USER_1_DOCTOR_1 +
          TOTAL_MEDICAL_RECORD_USER_1_DOCTOR_2
      );
    });
  });

  describe("Get medical records user_2", function () {
    it("return total records thang1", async () => {
      const records = await medicalRecord.getRecordsbyUserId("thang2");
      // console.log("thang2", records);
      expect(records.length).to.equal(
        TOTAL_MEDICAL_RECORD_USER_2_DOCTOR_1 +
          TOTAL_MEDICAL_RECORD_USER_2_DOCTOR_2
      );
    });
  });

  describe("editMedicalRecord", function () {
    it("emit editMedicalRecord", async function () {
      const recordId = 1;

      await expect(
        medicalRecord
          .connect(add1)
          .editMedicalRecord(
            recordId,
            JSON.stringify({ ...data, fullName: "new fullname" })
          )
      )
        .to.emit(medicalRecord, "EditMedicalRecord")
        .withArgs(recordId);
    });
  });

  describe("deleteMedicalRecord", function () {
    it("emit deleteMedicalRecord", async function () {
      const recordId = 2;
      await expect(medicalRecord.connect(add1).deleteMedicalRecord(recordId))
        .to.emit(medicalRecord, "DeleteMedicalRecord")
        .withArgs(recordId);
    });
  });

  describe("restoreMedicalRecord", function () {
    it("emit restoreMedicalRecord", async function () {
      const recordId = 2;
      await expect(medicalRecord.connect(add1).restoreMedicalRecord(recordId))
        .to.emit(medicalRecord, "RestoreMedicalRecord")
        .withArgs(recordId);
    });
  });

  // describe("getAll", function () {
  //   it("getAll", async function () {
  //     const records = await medicalRecord.getAll();
  //     console.log("records", records);
  //     expect(records.length).to.equal(
  //       TOTAL_MEDICAL_RECORD_DOCTOR_1 + TOTAL_MEDICAL_RECORD_DOCTOR_2
  //     );
  //   });
  // });

  describe("getOne", function () {
    it("getOne", async function () {
      const record = await medicalRecord.getMedicalRecord(2);
      console.log("records", record);
      expect(record[0]).to.equal(2);
    });
  });
});
