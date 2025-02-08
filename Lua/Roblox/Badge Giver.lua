local BadgeService = game:GetService("BadgeService")
local Players = game:GetService("Players")
 
Players.PlayerAdded:Connect(function(player)
    BadgeService:AwardBadge(player.UserId, 1234567890) -- Replace with your Badge ID
end)
