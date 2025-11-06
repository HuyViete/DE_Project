export const getAllTasks = (request, response) => {
  response.status(200).send("You have 1 task!")
}

export const createTasks = (req, res) => {
  res.status(201).json({message: "Tasks uploaded!"})
}

export const updateTasks = (req, res) => {
  res.status(200).json({message: "Tasks updated!"})
}

export const deleteTasks = (req, res) => {
  res.status(200).json({message: "Tasks deleted!"})
}