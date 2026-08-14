export function getProjectMember(
  project,
  userId
) {
  return project.members.find(
    (member) =>
      String(
        member.user?._id ||
          member.user
      ) === String(userId)
  );
}

export function canManageFiles(
  role
) {
  return (
    role === "admin" ||
    role === "editor"
  );
}

export function canDeleteFiles(
  role
) {
  return (
    role === "admin" ||
    role === "editor"
  );
}

export function canEditFileDetails(
  role
) {
  return role === "admin";
}