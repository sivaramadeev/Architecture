import { GoogleGenAI, Type } from "@google/genai";
import { Architecture, GcpServiceType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const architectureSchema = {
  type: Type.OBJECT,
  properties: {
    nodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING },
          label: { type: Type.STRING },
          x: { type: Type.NUMBER },
          y: { type: Type.NUMBER },
          group: { type: Type.STRING, nullable: true },
          ipAddress: { type: Type.STRING, nullable: true }
        },
        required: ["id", "type", "label", "x", "y"]
      }
    },
    edges: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          from: { type: Type.STRING },
          to: { type: Type.STRING },
          label: { type: Type.STRING }
        },
        required: ["id", "from", "to"]
      }
    },
    groups: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          label: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["region", "vpc", "zone", "project", "on-prem-dc"] },
          environment: { type: Type.STRING, enum: ["cloud", "on-prem"] },
          cidr: { type: Type.STRING, nullable: true },
          x: { type: Type.NUMBER },
          y: { type: Type.NUMBER },
          width: { type: Type.NUMBER },
          height: { type: Type.NUMBER }
        },
        required: ["id", "label", "type", "environment", "x", "y", "width", "height"]
      }
    },
    explanation: { type: Type.STRING },
    alternatives: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          estimatedCost: { type: Type.STRING },
          nodes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING },
                label: { type: Type.STRING },
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                group: { type: Type.STRING, nullable: true },
                ipAddress: { type: Type.STRING, nullable: true }
              },
              required: ["id", "type", "label", "x", "y"]
            }
          },
          edges: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                from: { type: Type.STRING },
                to: { type: Type.STRING },
                label: { type: Type.STRING }
              },
              required: ["id", "from", "to"]
            }
          },
          groups: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                type: { type: Type.STRING },
                environment: { type: Type.STRING, enum: ["cloud", "on-prem"] },
                cidr: { type: Type.STRING, nullable: true },
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                width: { type: Type.NUMBER },
                height: { type: Type.NUMBER }
              },
              required: ["id", "label", "type", "environment", "x", "y", "width", "height"]
            }
          }
        },
        required: ["title", "description", "pros", "cons", "estimatedCost", "nodes", "edges"]
      }
    }
  },
  required: ["nodes", "edges", "explanation", "alternatives"]
};

export async function generateArchitecture(prompt: string): Promise<Architecture> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `You are a Google Cloud Certified Professional Architect. 
    Design a GCP architecture for the following requirement: "${prompt}".
    
    Available GCP Service Types: ${Object.values(GcpServiceType).join(", ")}.
    
    Guidelines for the diagram:
    - Follow industry best practices for GCP architecture.
    - Use "groups" to represent Regions, VPCs, Zones, and On-Prem Data Centers.
    - Assign realistic CIDR ranges to VPCs (e.g., 10.0.0.0/16) and IP addresses to critical nodes.
    - Clearly separate "on-prem" and "cloud" environments using the environment field.
    - Place On-Prem components on the left (x: 0-400) and Cloud components on the right (x: 600-1600).
    - Place "External User" or "Internet" at the top (y around 50).
    - Place Load Balancers/Gateways below users (y around 200).
    - Place Compute/App services in the middle (y around 450).
    - Place Databases/Storage at the bottom (y around 800).
    - Ensure all nodes have unique IDs and logical connections.
    - Use a large canvas scale (HD standards) with coordinates up to 2000x1200.
    
    Provide a detailed explanation and 2-3 alternative solutions with cost estimates. Each alternative must also have its own node/edge/group layout.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: architectureSchema,
    },
  });

  return JSON.parse(response.text || "{}") as Architecture;
}
