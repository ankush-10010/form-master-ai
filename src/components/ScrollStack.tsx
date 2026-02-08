import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollStackProps {
    children: React.ReactNode;
    className?: string;
}

interface CardProps {
    i: number;
    children: React.ReactNode;
    progress: MotionValue<number>;
    range: [number, number];
    targetScale: number;
    total: number;
}

const Card = ({
    i,
    children,
    progress,
    range,
    targetScale,
    total
}: CardProps) => {

    // Map scroll progress (0..1) to scale (1..targetScale)
    // We want the card to stay at scale 1 until it's "its turn" to shrink? 
    // Actually, usually in a stack, the TOP card shrinks as the NEW card comes up.
    // But here, we map based on the global progress.

    const scale = useTransform(progress, range, [1, targetScale]);

    // Calculate a dynamic top offset so cards stack visibly
    // e.g. Card 0 at top:0, Card 1 at top:40px, etc.
    // But since they are sticky, they all stick to top. 
    // We can add a top margin or top property.

    return (
        <div
            className="h-screen flex items-start justify-center sticky top-0 pt-32"
        >
            <motion.div
                style={{
                    scale,
                    // Stacking effect: each card is slightly lower than the previous one to show the "stack"
                    top: `calc(10vh + ${i * 25}px)`,
                }}
                className="relative -top-[10vh] w-full origin-top"
            >
                {children}
            </motion.div>
        </div>
    );
};

export default function ScrollStack({ children, className = "" }: ScrollStackProps) {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start start", "end end"],
    });

    const childrenArray = React.Children.toArray(children);
    const len = childrenArray.length;

    return (
        // The container needs to be TALL enough to scroll through all cards.
        // e.g., 300vh or 400vh depending on number of cards.
        <div ref={container} className={`relative ${className}`} style={{ height: `${len * 100}vh` }}>
            {childrenArray.map((child, i) => {
                // Target scale: how small this card gets when it's fully buried
                const targetScale = 1 - (len - 1 - i) * 0.05;

                // Range: when does this specific card animate?
                // We divide the total scroll progress into chunks.
                return (
                    <Card
                        key={i}
                        i={i}
                        progress={scrollYProgress}
                        range={[i * (1 / len), 1]}
                        targetScale={targetScale}
                        total={len}
                    >
                        {child}
                    </Card>
                );
            })}
        </div>
    );
}

export const ScrollStackItem = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={cn(
            "w-full max-w-2xl mx-auto h-[500px] p-1 rounded-3xl overflow-hidden glass border border-white/10",
            className
        )}>
            {/* Inner content container */}
            <div className="bg-black/20 backdrop-blur-md p-8 md:p-12 w-full h-full flex flex-col justify-center items-center text-center">
                {children}
            </div>
        </div>
    );
};
