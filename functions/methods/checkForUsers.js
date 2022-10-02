const db = require('../db')

module.exports = (hour, day) => {
  const weeklyUsers = db.collection('users').where('day', '==', day).where('hour', '==', hour).get()
  const dailyUsers = db.collection('users').where('day', '==', -1).where('hour', '==', hour).get()

  return Promise.all([weeklyUsers, dailyUsers])
    .then(([weeklyUsers, dailyUsers]) => {
      const batch = db.batch()
      if (!weeklyUsers.empty) {
        weeklyUsers.forEach(user => batch.set(db.collection('queue').doc(), Object.assign({}, user.val(), {userId: user.id})))
      }
      if (!dailyUsers.empty) {
        dailyUsers.forEach(user => batch.set(db.collection('queue').doc(),  Object.assign({}, user.val(), {userId: user.id})))
      }
      return batch.commit()
    })

}
