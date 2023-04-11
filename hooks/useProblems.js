import { useState, useEffect } from "react";

export function useProblems() {
  const [problems, setProblems] = useState([])

  const operations = ['+', '-', '/', '*']
  const modifications = [-2, -1, 1, 2]

  useEffect(() => {
    createNewProblems()
  }, [])

  const createNewProblems = () => {
    const newProblems = [createProblem(), createProblem(), createProblem()]
    const indexToMakeWrong = Math.floor(Math.random() * 3)
    const modificationIndex = Math.floor(Math.random() * 4)
    newProblems[indexToMakeWrong].solution += modifications[modificationIndex]
    newProblems[indexToMakeWrong].isWrong = true
    setProblems(newProblems)
  }

  const createProblem = () => {
    let x = Math.ceil(Math.random() * 12)
    let y = Math.ceil(Math.random() * 12)
    const operationIndex = Math.floor(Math.random() * 4)
    const solution = calculateSolution(x, y, operations[operationIndex])
    if (operations[operationIndex] === '/') {
      return { x: solution, y: y, operation: operations[operationIndex], solution: x, isWrong: false }
    }
    return { x: x, y: y, operation: operations[operationIndex], solution: solution, isWrong: false }
  }

  const calculateSolution = (x, y, operation) => {
    switch (operation) {
      case '+':
        return x + y
      case '-':
        return x - y
      default:
        // return the product for both division and multiplication 
        return x * y
    }
  }

  return [problems, createNewProblems]
}