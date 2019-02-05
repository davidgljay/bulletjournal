module.exports.getDate = () => {
  const d = new Date()
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getYear() - 100}`
}
