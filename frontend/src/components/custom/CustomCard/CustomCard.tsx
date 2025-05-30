import React from "react";
import { Card, CardProps } from "antd";
import type { ReactNode } from "react";
import "./CustomCard.css";
import { useDesignToken } from "../../../DesignToken";

interface CustomCardProps extends CardProps {
  children: ReactNode;
  boxShadowEnable?: boolean;
}

const CustomCard: React.FC<CustomCardProps> = ({
  children,
  boxShadowEnable = false,
  ...rest
}) => {
  const token = useDesignToken();

  return (
    <Card
      {...rest}
      className={`custom-card ${rest.className || ""}`}
      style={{
        color: token.colorTextBase,
        fontFamily: token.fontFamily,
        borderRadius: token.borderRadiusMed,
        background: token.colorBgWhite,
        boxShadow: boxShadowEnable
          ? "0 4px 12px rgba(0, 0, 0, 0.1)"
          : undefined,
        ...rest.style,
      }}
    >
      {children}
    </Card>
  );
};

export default CustomCard;
