module.exports.getDate = () => {
  const d = new Date()
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getYear() - 100}`
}
