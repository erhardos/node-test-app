const controlerHandler = (promise, params) => async (req, res, next) => {
  const boundParams = params ? params(req, res, next) : []
  try {
    const result = await promise(...boundParams)
    return res.json({data: result} || {msg: 'OK'})
  } catch(err) {
    if (err.code)
      return res.status(err.code).json({msg: err.message})
    res.status(500).json({msg:'Unxepected error!.'})
  }
}

module.exports = controlerHandler