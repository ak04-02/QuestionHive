import { Link } from "wouter";
import { Eye, MessageSquare, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import VoteButtons from "@/components/vote-buttons";
import type { Question } from "@shared/schema";

interface QuestionCardProps {
  question: Question & {
    author?: {
      username: string;
      reputation: number;
    };
  };
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const getInitials = (username: string) => {
    return username
      .split("_")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex gap-6">
          <VoteButtons
            targetId={question.id}
            targetType="question"
            currentVotes={question.votes}
          />

          <div className="flex-1 min-w-0">
            <Link href={`/question/${question.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-stackit-blue cursor-pointer mb-2">
                {question.title}
              </h3>
            </Link>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {question.content.length > 150 
                ? `${question.content.slice(0, 150)}...` 
                : question.content
              }
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {question.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Question Meta */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  {question.answerCount} answer{question.answerCount !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  {question.views} view{question.views !== 1 ? 's' : ''}
                </span>
                {question.accepted && (
                  <Badge className="bg-stackit-green text-white text-xs">
                    <Check size={12} className="mr-1" />
                    Accepted
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span>asked {formatTimeAgo(question.createdAt)}</span>
                <div className="flex items-center gap-1">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white text-xs font-semibold">
                      {getInitials(question.author?.username || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{question.author?.username}</span>
                  <span className="text-stackit-blue font-medium">
                    {question.author?.reputation?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
