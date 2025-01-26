"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Bike from "@/assets/bike.png"
import Car from "@/assets/car.png"
import { Card } from "@/components/ui/card"
import styles from "./category.module.css"

export default function Category() {
  const [hoveredVehicle, setHoveredVehicle] = useState(null)

  const vehicleImages = {
    bike: Bike,
    car: Car
  }

  const vehicleContent = {
    bike: {
      title: "Bike",
      message: "Hello, go get your bike.",
    },
    car: {
      title: "Car",
      message: "Hello, go get your car.",
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.vehicleWrapper}>
        {["bike", "car"].map((vehicle) => (
          <Card
            key={vehicle}
            className={styles.vehicleCard}
            onMouseEnter={() => setHoveredVehicle(vehicle)}
            onMouseLeave={() => setHoveredVehicle(null)}
          >
            <AnimatePresence>
              {hoveredVehicle === vehicle ? (
                <>
                  <motion.div
                    className={styles.vehicleAnimation}
                    initial={{ x: 0 }}
                    animate={{ x: "100%" }}
                    exit={{ x: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  >
                    <div className={styles.imageContainer}>
                      <Image
                        src={vehicleImages[vehicle]}
                        alt={`Sports ${vehicle}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <motion.div
                      className={styles.movingDots}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={styles.dot}
                          initial={{ x: 0, y: Math.random() * 20 - 10 }}
                          animate={{ x: -100 - (i * 10), opacity: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: i * 0.05,
                            repeat: Infinity,
                            repeatDelay: 0.2
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                  <motion.div
                    className={styles.hoverContent}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className={styles.title}>{vehicleContent[vehicle].title}</h2>
                    <p className={styles.message}>{vehicleContent[vehicle].message}</p>
                    <button className={styles.exploreButton}>Explore</button>
                  </motion.div>
                </>
              ) : (
                <div className={styles.vehicleContent}>
                  <div className={styles.imageContainer}>
                    <Image
                      src={vehicleImages[vehicle]}
                      alt={`Sports ${vehicle}`}
                      fill
                      className="object-contain car"
                    />
                  </div>
                  <span className={styles.vehicleLabel}>
                    {vehicleContent[vehicle].title}
                  </span>
                </div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </div>
  )
}