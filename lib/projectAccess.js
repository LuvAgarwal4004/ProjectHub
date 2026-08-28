import Project from "@/models/Project";

/*
 * Find the current user's membership.
 */
export function getProjectMember(project, userId) {
  return project.members.find(
    (member) =>
      String(
        member.user?._id ||
        member.user
      ) === String(userId)
  );
}

/*
 * ADMIN
 */
export function isProjectAdmin(
  project,
  userId
) {
  const member = getProjectMember(
    project,
    userId
  );

  return member?.role === "admin";
}

/*
 * ADMIN OR EDITOR
 */
export function canEditProject(
  project,
  userId
) {
  const member = getProjectMember(
    project,
    userId
  );

  return (
    member &&
    ["admin", "editor"].includes(
      member.role
    )
  );
}

/*
 * IMPORTANT:
 *
 * Returns false if project is closed.
 */
export function canModifyOpenProject(
  project,
  userId
) {
  if (
    project.status === "closed"
  ) {
    return false;
  }

  return canEditProject(
    project,
    userId
  );
}

/*
 * ADMIN ONLY + CLOSED PROJECT CAN BE REOPENED
 */
export function canReopenProject(
  project,
  userId
) {
  return isProjectAdmin(
    project,
    userId
  );
}