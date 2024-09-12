'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, X } from "lucide-react"

export default function Component() {
  const [names, setNames] = useState<string[]>([])
  const [newName, setNewName] = useState('')
  const [winner, setWinner] = useState<string | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinCount, setSpinCount] = useState(0)

  const capitalize = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
  }

  const addName = () => {
    if (newName.trim() !== '' && !names.includes(capitalize(newName.trim()))) {
      setNames([...names, capitalize(newName.trim())])
      setNewName('')
    }
  }

  const removeName = (nameToRemove: string) => {
    setNames(names.filter(name => name !== nameToRemove))
  }

  const spinWheel = () => {
    if (names.length > 0) {
      setIsSpinning(true)
      setWinner(null)
      
      const spinDuration = 2000 + Math.random() * 2000 // 2-4 seconds
      const intervalDuration = 100
      let elapsedTime = 0
      let finalWinner: string

      if (spinCount === 0) {
        // First spin: favor names starting with 'g' or 'G'
        const gNames = names.filter(name => name.toLowerCase().startsWith('g'))
        finalWinner = gNames.length > 0 ? gNames[Math.floor(Math.random() * gNames.length)] : names[Math.floor(Math.random() * names.length)]
      } else {
        // Subsequent spins: completely random
        finalWinner = names[Math.floor(Math.random() * names.length)]
      }

      const interval = setInterval(() => {
        elapsedTime += intervalDuration
        const randomName = names[Math.floor(Math.random() * names.length)]
        setWinner(randomName)

        if (elapsedTime >= spinDuration) {
          clearInterval(interval)
          setWinner(finalWinner)
          setIsSpinning(false)
          setSpinCount(prevCount => prevCount + 1)
        }
      }, intervalDuration)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-600 to-blue-600">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Ruleta de Sorteos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Ingresa un nombre"
                value={newName}
                onChange={(e) => setNewName(capitalize(e.target.value))}
                onKeyPress={(e) => e.key === 'Enter' && addName()}
                className="capitalize"
              />
              <Button onClick={addName}>Agregar</Button>
            </div>
            
            <ScrollArea className="h-40 border rounded-md p-2">
              {names.map((name, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="capitalize">{name}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeName(name)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </ScrollArea>
            
            <Button 
              className="w-full" 
              onClick={spinWheel} 
              disabled={names.length === 0 || isSpinning}
            >
              {isSpinning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Girando...
                </>
              ) : 'Girar la Ruleta'}
            </Button>
            
            {winner && (
              <div className="text-center p-4 bg-green-100 rounded-md">
                <p className="font-semibold">¡Ganador!</p>
                <p className="text-xl capitalize">{winner}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}