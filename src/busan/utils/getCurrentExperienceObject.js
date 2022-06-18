export default function getCurrentExperienceObject(experiences) {
  for (let i = 0; i < experiences.length; i += 1) {
    if (experiences[i].is_ongoing) {
      return experiences[i];
    }
  }

  return null;
}
