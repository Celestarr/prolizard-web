export default function getHighestEducationObject(academicRecords) {
  for (let i = 0; i < academicRecords.length; i += 1) {
    return academicRecords[i];
  }

  return null;
}
