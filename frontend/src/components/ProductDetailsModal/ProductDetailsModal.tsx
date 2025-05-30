import {
  Modal,
  Flex,
  Space,
  Image,
  Divider,
  InputNumber,
  Form,
  Typography,
} from "antd";
import { useDesignToken } from "../../DesignToken";
import CustomTypography from "../custom/CustomTypography/CustomTypography";
import { useEffect } from "react";

const { Text } = Typography;

interface ProductDetailsModalProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    images: string;
    category: string;
    stock: number;
    hasDiscount: boolean;
    discountPercentage: number;
  };
  isOpen: boolean;
  quantity: number;
  onQuantityChange: (value: number) => void;
  onCancel: () => void;
  onOk: () => void;
}

const ProductDetailsModal = ({
  product,
  isOpen,
  quantity,
  onQuantityChange,
  onCancel,
  onOk,
}: ProductDetailsModalProps) => {
  const token = useDesignToken();
  const [form] = Form.useForm();

  // Reset form and validation when modal opens/closes or product changes
  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({ quantity });
    } else {
      form.resetFields();
    }
  }, [isOpen, product, form, quantity]);

  // Handle form submission
  const handleSubmit = () => {
    form
      .validateFields()
      .then(() => {
        onOk();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Calculate discounted price if hasDiscount is true
  const discountedPrice = product.hasDiscount
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  // Calculate total price based on quantity and whether there's a discount
  const totalPrice = quantity * discountedPrice;

  return (
    <Modal
      title="Product Details"
      open={isOpen}
      onOk={handleSubmit}
      okText="Add to Cart"
      cancelText="Cancel"
      onCancel={onCancel}
      width={700}
      style={{ top: 20 }}
      bodyStyle={{ padding: "24px" }}
    >
      <Flex gap={24}>
        <div style={{ width: "40%" }}>
          <Image
            src={`data:image/png;base64,${product.images}`}
            alt={product.name}
            width="100%"
            style={{ borderRadius: token.borderRadiusMed }}
          />
        </div>
        <Space direction="vertical" size="large" style={{ width: "60%" }}>
          <CustomTypography.Title level={3} style={{ margin: 0 }}>
            {product.name}
          </CustomTypography.Title>

          {/* Price display with discount handling */}
          {product.hasDiscount ? (
            <Flex align="center" gap={8}>
              <Text
                delete
                type="secondary"
                style={{ fontSize: token.fontSizeLg }}
              >
                ${product.price.toFixed(2)}
              </Text>
              <CustomTypography.Title
                level={4}
                style={{ margin: 0, color: token.colorError }}
              >
                ${discountedPrice.toFixed(2)}
              </CustomTypography.Title>

              <Text
                style={{
                  backgroundColor: token.colorError,
                  color: token.colorBgWhite,
                  fontSize: token.fontSizeSmall,
                  padding: "2px 8px",
                  borderRadius: token.borderRadiusSmall,
                  marginLeft: "4px",
                }}
              >
                {product.discountPercentage}% OFF
              </Text>
            </Flex>
          ) : (
            <CustomTypography.Title
              level={4}
              style={{ margin: 0, color: token.colorPrimary }}
            >
              ${product.price.toFixed(2)}
            </CustomTypography.Title>
          )}

          <CustomTypography.Text type="secondary">
            Category: {product.category}
          </CustomTypography.Text>

          <CustomTypography.Text>
            Available in stock: {product.stock}
          </CustomTypography.Text>

          <Divider />
          <CustomTypography.Text type="secondary">
            Description
          </CustomTypography.Text>
          <CustomTypography.Paragraph
            style={{ maxHeight: "150px", overflowY: "auto" }}
          >
            {product.description}
          </CustomTypography.Paragraph>

          <Divider />

          <Form form={form} layout="vertical" style={{ width: "100%" }}>
            <Form.Item
              label={
                <CustomTypography.Text strong>Quantity</CustomTypography.Text>
              }
              name="quantity"
              rules={[
                { required: true, message: "Please enter a quantity" },
                {
                  validator: (_, value) => {
                    if (value > product.stock) {
                      return Promise.reject(
                        `Only ${product.stock} item${
                          product.stock === 1 ? "" : "s"
                        } available in stock`
                      );
                    }
                    if (value < 1) {
                      return Promise.reject("Quantity must be at least 1");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              initialValue={quantity}
            >
              <InputNumber
                min={1}
                max={product.stock}
                style={{ width: "100%" }}
                onChange={(value) => {
                  const newValue = value || 1;
                  onQuantityChange(newValue);
                  form.setFieldsValue({ quantity: newValue });
                }}
              />
            </Form.Item>

            {/* Updated total price display */}
            <CustomTypography.Text type="secondary">
              Total: <Text strong>${totalPrice.toFixed(2)}</Text>
              {product.hasDiscount && (
                <Text type="secondary" style={{ marginLeft: "8px" }}>
                  (You save: $
                  {(quantity * product.price - totalPrice).toFixed(2)})
                </Text>
              )}
            </CustomTypography.Text>
          </Form>
        </Space>
      </Flex>
    </Modal>
  );
};

export default ProductDetailsModal;
