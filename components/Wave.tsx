import React from "react";

interface WaveProps {
    fill?: string;
    direction?: "up" | "down";
    className?: string;
}

export default function Wave({ fill = "var(--background)", direction = "up", className = "" }: WaveProps) {
    const isUp = direction === "up";

    return (
        <div
            className={className}
            style={{
                position: "absolute",
                left: 0,
                width: "100%",
                overflow: "hidden",
                lineHeight: 0,
                [isUp ? "bottom" : "top"]: 0,
                transform: isUp ? "none" : "rotate(180deg)",
                zIndex: 1
            }}
        >
            <svg
                viewBox="0 0 1440 320"
                style={{
                    display: "block",
                    width: "calc(100% + 1.3px)",
                    height: "100px"
                }}
            >
                <path
                    fill={fill}
                    fillOpacity="1"
                    d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
            </svg>
        </div>
    );
}
