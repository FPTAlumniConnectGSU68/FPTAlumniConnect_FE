export const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800"
    case "alumni":
      return "bg-blue-100 text-blue-800"
    case "teacher":
      return "bg-green-100 text-green-800"
    case "student":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
